import http from "http"
import dotenv from "dotenv"
import express from "express"

dotenv.config()

const app = express()

// app.use()

const server = http.createServer(app)

server.listen(process.env.PORT, () => {
    console.log("Server running at", process.env.PORT)
})
