# 🎟️ Event Booking System (Node.js + TypeScript + Sequelize)

A backend service for **event booking and management**, built using **Node.js**, **TypeScript**, **Express**, **SQLite**, **Sequelize**, and **BullMQ** for background job processing.

---

## 📚 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Domain Overview](#domain-overview)
- [Database Schema](#database-schema)
- [Setup Instructions](#️setup-instructions)
- [API Endpoints](#api-endpoints)
- [Background Jobs](#background-jobs-bullmq)
- [Testing](#testing)
- [Role-Based Access Control](#role-based-access-control)
- [Key Design Decisions](#key-design-decisions)
- [Common Commands](#common-commands)
- [Author](#author)

---

## 🚀 Tech Stack

- **Node.js**
- **TypeScript**
- **Express**
- **SQLite**
- **Sequelize ORM**
- **BullMQ** (Redis-based job queue)
- **Jest + Supertest** (testing)

---

## 📂 Project Structure

```
.
├── index.ts
├── config/
│   └── config.json
├── migrations/
├── seeders/
├── models/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   └── utils.ts
├── tests/
├── event_booking.sqlite
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧠 Domain Overview

### Users
- Roles:
  - `organizer`
  - `customer`

### Events
- Categories:
  - `concert`
  - `standup`
  - `play`
  - `movie`
  - `exhibition`

### Event Attendees
- Maps **customers ↔ events**
- Tracks booked tickets

---

## 🗄️ Database Schema

### users
- `id (UUID)`
- `first_name`
- `last_name`
- `email`
- `role`
- timestamps (with soft delete)

### events
- `id (UUID)`
- `name`
- `description`
- `category`
- `event_date`
- `total_tickets`
- `available_tickets`
- `organizer_id (FK → users.id)`

### event_attendees
- `id (UUID)`
- `customer_id (FK → users.id)`
- `event_id (FK → events.id)`
- `tickets_booked`

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Environment Variables

Create a `.env` file:

```env
PORT=
REDIS_HOST=
REDIS_PORT=
NODE_ENV=
```

Make sure **Redis** is running locally.

---

### 3️⃣ Run Migrations

```bash
npx sequelize-cli db:migrate
```

---

### 4️⃣ Seed the Database

```bash
npx sequelize-cli db:seed:all
```

This will create:
- Demo users
- Demo events

---

### 5️⃣ Start the Server

```bash
npm run dev
```

Server runs at:
```
http://localhost:3000
```

---

## 🔌 API Endpoints

### 🎫 Book Event (Customer only)

**POST** `/api/v1/events/book`

```json
{
  "userId": "UUID",
  "eventId": "UUID",
  "ticketsCount": 2
}
```

#### Validations
- User must exist
- User must be `customer`
- Event must exist
- Event must not be expired
- Enough tickets must be available

➡️ Booking is processed asynchronously using **BullMQ**

---

### 🛠️ Update Event (Organizer only)

**PATCH** `/api/v1/events/:eventId`

```json
{
  "userId": "UUID",
  "eventId": "UUID",
  "eventNewDate": "2026-03-01T18:30:00.000Z"
}
```

---

## 🧵 Background Jobs (BullMQ)

### Queues
- `tasksQueue`
- `retryQueue`
- `dlq` (Dead Letter Queue)

### Job Types
- `book_event`
- `update_event`

### Flow
```
tasksQueue → retryQueue → dlq
```

Failed jobs are retried with **exponential backoff** before moving to DLQ.

---

## 🧪 Testing

Integration tests using **Jest + Supertest**

```bash
npm test
```

Covered scenarios:
- Successful event booking
- HTTP `202 Accepted` response
- Validation failures

---

## 🔐 Role-Based Access Control

- **Customer**
  - Can book events
- **Organizer**
  - Can update event details

Handled via Express middlewares.

---

## 🧠 Key Design Decisions

- **SQLite** for simplicity & portability
- **UUIDs** for primary & foreign keys
- **Soft deletes** (`deleted_at`)
- **Async processing** for booking & updates
- **Strict validations before queuing jobs**

---

## 📌 Common Commands

```bash
# Run specific seeder
npx sequelize-cli db:seed --seed <filename>

# Undo last seeder
npx sequelize-cli db:seed:undo

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

---

## 🧑‍💻 Author

**Vinay Kumar**

---