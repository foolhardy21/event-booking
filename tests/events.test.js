import supertest from "supertest"
import app from "../index"

describe("Events Integration Testing", () => {

    beforeAll(async () => {
    })

    it("should book an event successfully", async () => {
        const payload = {
            userId: "9f2c1c8e-6d7a-4f4b-9f7e-1b7d5e6a2c91", // Vinay (customer)
            eventId: "e7b2a6d4-3c9f-4e1a-8f5b-2d9c6a4e1b78", // Biswa Genius event
            ticketsCount: 2
        }

        const response = await supertest(app)
            .post("/api/v1/events/book")
            .send(payload)
            .expect(202)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("Seats confirmed successfully.")
    })
})