import dotenv from "dotenv"
import IORedis from "ioredis"
import { Job, JobsOptions, Queue, Worker } from "bullmq"
import { JOB_TYPES } from "../../utils"
import { bookEvent, updateEvent } from "./eventsBooking"

dotenv.config()

class BackgroundTasks {
    #redisCon

    #tasksQueue: Queue
    #tasksQueueWorker: Worker

    #retryQueue: Queue
    #retryQueueWorker: Worker

    #dlq: Queue
    #dlqWorker: Worker

    constructor() {
        this.#redisCon = new IORedis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            maxRetriesPerRequest: null,
        })
        this.#tasksQueue = new Queue("tasksQueue", {
            connection: this.#redisCon,
            defaultJobOptions: {
                attempts: 1,
                removeOnComplete: true,
                removeOnFail: true,
            }
        })
        this.#tasksQueueWorker = new Worker("tasksQueue", this.processJob, {
            connection: this.#redisCon,
        })
        this.#tasksQueueWorker.on("failed", async (job) => this.moveToRetry(job as Job))

        this.#retryQueue = new Queue("retryQueue", {
            connection: this.#redisCon,
            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: true,
            }
        })
        this.#retryQueueWorker = new Worker("retryQueue", this.processJob, {
            connection: this.#redisCon,
        })
        this.#retryQueueWorker.on("failed", async (job) => this.moveToDlq(job as Job))

        this.#dlq = new Queue("dlq", {
            connection: this.#redisCon,
            defaultJobOptions: {
                attempts: 1,
                removeOnComplete: true,
                removeOnFail: true,
            }
        })
        this.#dlqWorker = new Worker("dlq", this.processDlq, {
            connection: this.#redisCon,
        })
        this.#dlqWorker.on("failed", () => { })
    }

    async addJob({ jobName, data, options }: { jobName: string, data: any, options: JobsOptions }) {
        try {
            await this.#tasksQueue.add(jobName, data, options)
            console.log("Job added: ", jobName, data)
        } catch (err) {
            console.log("Error while adding job to the queue: ", err)
        }
    }

    async processJob(job: Job) {
        const { name, data, queueName } = job
        console.log("Processing Job: ", name, " in ", queueName, data)
        switch (name) {
            case JOB_TYPES.BOOK_EVENT:
                bookEvent({
                    userId: data.userId,
                    eventId: data.eventId,
                    ticketsCount: data.ticketsCount,
                    availableTickets: data.availableTickets
                })
                break
            case JOB_TYPES.UPDATE_EVENT:
                updateEvent({
                    eventId: data.eventId,
                    eventNewDate: data.eventNewDate,
                })
                break
            default: return
        }
    }

    async processDlq(job: Job) {
        const tasks = [job].map(jobObj => ({ type: jobObj.name, data: jobObj.data }))
        console.log("Processing DLQ Job: ", tasks)
    }

    async moveToRetry(job: Job) {
        const { name, data } = job
        console.log("Moving to Retry: ", job.name)
        this.#retryQueue.add(name, data, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            }
        })
    }

    async moveToDlq(job: Job) {
        console.log("Moving to DLQ: ", job.name)
        this.#dlq.add(job.name, job.data)
    }
}
const backgroundTasks = new BackgroundTasks()

export default backgroundTasks