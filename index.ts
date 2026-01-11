import http from "http"
import dotenv from "dotenv"
import express from "express"
import eventsRouter from "./src/routes/eventRoutes"

dotenv.config()

const app = express()

app.use(express.json())

app.use("/api/v1/events", eventsRouter)

const server = http.createServer(app)

server.listen(process.env.PORT, () => {
    console.log("Server running at", process.env.PORT)
})

export default app