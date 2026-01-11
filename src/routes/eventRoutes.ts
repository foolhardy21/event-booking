import { Router } from "express"
import { validateCreateEvent, validateCustomerRole, validateOrganizerRole, validateUpdateEvent } from "../middlewares/eventMiddlewares"
import { createEvent, updateEvent } from "../controllers/eventControllers"

const eventsRouter = Router()

eventsRouter.patch("/:eventId", validateOrganizerRole, validateUpdateEvent, updateEvent)
eventsRouter.post("/book", validateCustomerRole, validateCreateEvent, createEvent)

export default eventsRouter