import { NextFunction, Request, Response } from "express";
import dbInstance from "../services/database";
import { Op } from "sequelize";
import { USER_ROLES } from "../../utils";

export async function validateCreateEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticketsCount, eventId } = req.body

        const events = await dbInstance.getEvent({
            where: {
                id: { [Op.eq]: eventId }
            },
            options: {},
        })
        if (events.length != 1) {
            return res.status(400).json({ success: false, message: "This event is not available." })
        }
        const [event] = events
        if (event.availableTickets < ticketsCount) {
            return res.status(400).json({ success: false, message: `Only ${event.availableTickets} seats are left.` })
        }
        if (event.eventDate < new Date()) {
            return res.status(400).json({ success: false, message: "This event has expired." })
        }
        (req as any).availableTickets = event.available_tickets
        next()
    } catch (err: any) {
        console.log("Error validating the event payload: ", err)
        return res.status(400).json({ success: false, message: err?.message })
    }
}

export async function validateUpdateEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const { eventId, eventNewDate } = req.body

        const events = await dbInstance.getEvent({
            where: {
                id: { [Op.eq]: eventId }
            },
            options: {},
        })
        if (events.length != 1) {
            return res.status(400).json({ success: false, message: "This event is not available." })
        }
        const [event] = events
        if (new Date(event.eventDate) < new Date()) {
            return res.status(400).json({ success: false, message: "This event has expired." })
        }
        if (new Date(eventNewDate) < new Date()) {
            return res.status(400).json({ success: false, message: "Proposed event time is invalid." })
        }
        next()
    } catch (err: any) {
        console.log("Error validating the event payload: ", err)
        return res.status(400).json({ success: false, message: err?.message })
    }
}

export async function validateCustomerRole(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.body

        const users = await dbInstance.getUser({
            where: {
                id: { [Op.eq]: userId }
            },
            options: {},
        })
        if (users.length != 1) {
            return res.status(401).json({ success: false, message: "User is invalid." })
        }
        const [user] = users
        if (user.role != USER_ROLES.CUSTOMER) {
            return res.status(403).json({ success: false, message: "Booking tickets is not allowed for you." })
        }
        next()
    } catch (err: any) {
        console.log("Error validating the user role: ", err)
        return res.status(400).json({ success: false, message: err?.message })
    }
}

export async function validateOrganizerRole(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.body

        const users = await dbInstance.getUser({
            where: {
                id: { [Op.eq]: userId }
            },
            options: {},
        })
        if (users.length != 1) {
            return res.status(401).json({ success: false, message: "User is invalid." })
        }
        const [user] = users
        if (user.role != USER_ROLES.ORGANIZER) {
            return res.status(403).json({ success: false, message: "Managing events is not allowed for you." })
        }
        next()
    } catch (err: any) {
        console.log("Error validating the user role: ", err)
        return res.status(400).json({ success: false, message: err?.message })
    }
}
