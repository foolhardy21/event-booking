import { Op } from "sequelize"
import dbInstance from "./database"

export async function bookEvent(
    { userId, eventId, ticketsCount, availableTickets }:
        { userId: string, eventId: string, ticketsCount: number, availableTickets: number }
) {
    await dbInstance.createEventAttendee({
        customerId: userId,
        eventId: eventId,
        ticketsBooked: ticketsCount,
    })

    await dbInstance.updateEvent(
        {
            available_tickets: Number(availableTickets) - Number(ticketsCount),
        },
        {
            where: { id: { [Op.eq]: eventId } }
        }
    )

    console.log("Email sent: ", "Booking confirmed")
}

export async function updateEvent(
    { eventId, eventNewDate }:
        { eventId: string, eventNewDate: Date }
) {

    await dbInstance.updateEvent(
        {
            event_date: new Date(eventNewDate),
        },
        {
            where: { id: { [Op.eq]: eventId } }
        }
    )

    console.log("Email sent: ", "Event updated")
}