import { NextFunction, Request, Response } from "express";
import backgroundTasks from "../services/backgroundTasks";
import { JOB_TYPES } from "../../utils";

export async function createEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, eventId, ticketsCount } = req.body
        const availableTickets = (req as any).availableTickets
        await backgroundTasks.addJob({
            jobName: JOB_TYPES.BOOK_EVENT,
            data: {
                userId,
                eventId,
                ticketsCount,
                availableTickets,
            },
            options: {},
        })

        return res.status(202).json({ success: true, message: "Seats confirmed successfully." })
    } catch (err: any) {
        console.log("Error creating the event: ", err)
        return res.status(400).json({ success: false, message: err?.message })
    }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const { eventId, eventNewDate } = req.body

        await backgroundTasks.addJob({
            jobName: JOB_TYPES.UPDATE_EVENT,
            data: {
                eventId,
                eventNewDate,
            },
            options: {},
        })

        return res.status(202).json({ success: true, message: "Event update confirmed successfully." })
    } catch (err: any) {
        console.log("Error creating the event: ", err)
        return res.status(400).json({ success: false, message: err?.message })
    }
}