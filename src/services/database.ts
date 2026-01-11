import path from "path"
import { DataTypes, FindOptions, Sequelize, UpdateOptions, WhereOptions } from "sequelize"
import { EVENT_CATEGORIES, USER_ROLES } from "../../utils"

class Database {
    #sequelize
    #User
    #Event
    #EventAttendee

    constructor() {
        this.#sequelize = new Sequelize({
            dialect: "sqlite",
            storage: path.resolve(__dirname, "../../event_booking.sqlite")
        })
        this.#User = this.#sequelize.define(
            "User",
            {
                id: {
                    type: DataTypes.UUIDV4(),
                    primaryKey: true,
                },
                first_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                last_name: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                email: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                role: {
                    type: DataTypes.ENUM(...Object.values(USER_ROLES)),
                    allowNull: false,
                    defaultValue: "customer",
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                tableName: "users",
                underscored: true,
                timestamps: true,
            },
        )
        this.#Event = this.#sequelize.define(
            "Event",
            {
                id: {
                    type: DataTypes.UUIDV4(),
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                category: {
                    type: DataTypes.ENUM(...Object.values(EVENT_CATEGORIES)),
                    allowNull: false,
                },
                event_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                total_tickets: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                available_tickets: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                organizer_id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    }
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                tableName: "events",
                underscored: true,
                timestamps: true,
            },
        )
        this.#EventAttendee = this.#sequelize.define(
            "EventAttendee",
            {
                id: {
                    type: DataTypes.UUIDV4(),
                    primaryKey: true,
                },
                customer_id: {
                    type: DataTypes.UUIDV4(),
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    }
                },
                event_id: {
                    type: DataTypes.UUIDV4(),
                    allowNull: false,
                    references: {
                        model: "events",
                        key: "id",
                    }
                },
                tickets_booked: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                tableName: "event_attendees",
                underscored: true,
                timestamps: true,
            },
        )
    }

    async init() {
        try {
            await this.#sequelize.authenticate()
        } catch (err) {
            console.log(err)
        }
    }

    async getUser({ where, options }: { where: WhereOptions, options: FindOptions }) {
        try {
            const userModels = await this.#User.findAll({
                ...(where && { where }),
                ...(options && options),
            })
            return userModels.map(userModel => userModel.toJSON())
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }

    async updateUser(columns: Record<string, unknown>, options: { where: WhereOptions } & Partial<UpdateOptions>) {
        try {
            await this.#User.update(columns, options)
        } catch (err) {
            console.log(err)
        }
    }

    async getEvent({ where, options }: { where: WhereOptions, options: FindOptions }) {
        try {
            const eventModels = await this.#Event.findAll({
                ...(where && { where }),
                ...(options && options),
            })
            return eventModels.map(eventModel => eventModel.toJSON())
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }

    async updateEvent(columns: Record<string, unknown>, options: { where: WhereOptions } & Partial<UpdateOptions>) {
        try {
            await this.#Event.update(columns, options)
        } catch (err) {
            console.log(err)
        }
    }

    async getEventAttendee({ where, options }: { where: WhereOptions, options: FindOptions }) {
        try {
            const attendeeModels = await this.#EventAttendee.findAll({
                ...(where && { where }),
                ...(options && options),
            })
            return attendeeModels.map(attendeeModel => attendeeModel.toJSON())
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }

    async createEventAttendee({ customerId, eventId, ticketsBooked }: { customerId: string, eventId: string, ticketsBooked: number }) {
        try {
            const attendeeModel = await this.#EventAttendee.create({
                ...(customerId && { customer_id: customerId }),
                ...(eventId && { event_id: eventId }),
                ...(ticketsBooked && { tickets_booked: ticketsBooked }),
            })
            return attendeeModel.toJSON()
        } catch (err) {
            console.log(err)
        }
    }

    async updateEventAttendee(columns: Record<string, unknown>, options: { where: WhereOptions } & Partial<UpdateOptions>) {
        try {
            await this.#EventAttendee.update(columns, options)
        } catch (err) {
            console.log(err)
        }
    }
}

const dbInstance = new Database()
dbInstance.init()

export default dbInstance