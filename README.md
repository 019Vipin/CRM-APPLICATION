# CRM Ticket Management & Notification Platform

A full-featured **Customer Relationship Management (CRM)** backend system built with **Node.js**, **Express**, **MongoDB**, and **Redis**. It includes a standalone **Notification Microservice** for event-driven email delivery.

---

## Architecture

```
CRM-APP/
├── CRMAPP/                    # Main CRM API Service (Port 7777)
│   ├── config/                # Redis publisher
│   ├── controllers/           # Auth, User, Ticket, Engineer, Admin
│   ├── middlewares/           # JWT auth, role guards
│   ├── models/                # User & Ticket Mongoose models
│   ├── routes/                # Express route definitions
│   └── utils/                 # Constants, response converters
│
└── notification-service/      # Notification Microservice (Port 8888)
    ├── config/                # Redis consumer
    ├── controllers/           # Notification CRUD
    ├── models/                # Notification Mongoose model
    ├── routes/                # Notification API routes
    ├── scheduler/             # node-cron background job
    └── services/              # Nodemailer email service
```

---

## Features

### Authentication & User Management
- `POST /crm/api/v1/auth/signup` — Register as CUSTOMER, ENGINEER, or ADMIN
- `POST /crm/api/v1/auth/signin` — Login and receive JWT token
- Engineers/Admins require admin approval before login (status: `PENDING`)

### User Administration (Admin only)
- `GET /crm/api/v1/users` — List all users (filter by type/status)
- `GET /crm/api/v1/users/:id` — Get user by userId
- `PUT /crm/api/v1/users/:id` — Update user status or role

### Ticket Management
- `POST /crm/api/v1/tickets` — Create ticket (auto-assigns to available engineer)
- `GET /crm/api/v1/tickets` — List tickets (scoped by role)
- `GET /crm/api/v1/tickets/:id` — Get single ticket
- `PUT /crm/api/v1/tickets/:id` — Update ticket (owner/assignee/admin)
- `GET /crm/api/v1/tickets/search` — Search by status/priority/category/etc.

### Engineer APIs
- `GET /crm/api/v1/engineers/tickets` — My assigned tickets
- `PUT /crm/api/v1/engineers/tickets/:id` — Update status, add comments
- `PUT /crm/api/v1/engineers/tickets/:id/assign` — Assign to self or another engineer

### Admin APIs
- `GET /crm/api/v1/admin/customers` — All customers
- `GET /crm/api/v1/admin/issues` — All tickets with filters (status, engineer, priority, date range, etc.)

### Notification Service
- `POST /notifications` — Queue a notification event
- `GET /notifications` — List notifications (filter by ticketId)
- `GET /notifications/:id` — Check delivery status

---

## Ticket States

```
OPEN → ASSIGNED → IN_PROGRESS → ON_HOLD → RESOLVED → CLOSED
                                                    ↑
                                               REOPENED
```

---

## User Roles & Statuses

| Role     | Registration Status |
|----------|-------------------|
| CUSTOMER | APPROVED immediately |
| ENGINEER | PENDING until admin approves |
| ADMIN    | PENDING until admin approves |

---

## Redis Integration

The CRM service publishes events to the `crm:notifications` Redis queue on:
- Ticket created → `TICKET_CREATED`
- Ticket updated → `TICKET_UPDATED`  
- Ticket assigned → `TICKET_ASSIGNED`

The Notification Service polls the queue every **10 seconds** via `node-cron` and:
1. Determines recipients based on event type
2. Sends email via Nodemailer (or logs to console in dev mode)
3. Stores delivery status in MongoDB
4. Retries failed notifications every **5 minutes** (max 3 retries)

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Setup CRM Service

```bash
cd CRMAPP
cp .env.example .env   # Fill in your values
npm install
npm start
```

### Setup Notification Service

```bash
cd notification-service
cp .env.example .env   # Fill in your values
npm install
npm start
```

---

## Environment Variables

### CRMAPP/.env

```env
PORT=7777
MONGODB_URI=mongodb://127.0.0.1:27017/crm
SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_QUEUE=crm:notifications
```

### notification-service/.env

```env
NOTIFICATION_PORT=8888
MONGODB_URI=mongodb://127.0.0.1:27017/crm
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_QUEUE=crm:notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## Default Admin Account

An admin account is auto-created on first startup:

| Field  | Value                 |
|--------|-----------------------|
| userId | admin                 |
| email  | vipinkr0818@gmail.com |
| password | welcome1           |

> ⚠️ Change the default admin credentials immediately in production.

---

## Tech Stack

| Component       | Technology         |
|-----------------|--------------------|
| Runtime         | Node.js            |
| Framework       | Express.js         |
| Database        | MongoDB + Mongoose |
| Authentication  | JWT + bcrypt       |
| Message Queue   | Redis (ioredis)    |
| Scheduler       | node-cron          |
| Email           | Nodemailer         |
