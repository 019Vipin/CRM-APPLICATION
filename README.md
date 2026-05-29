
# 🚀 CRM Application (Customer Relationship Management System)

A powerful backend CRM (Customer Relationship Management) system built using **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

The application provides REST APIs to manage customer complaints, assign support engineers, monitor ticket status, and handle the complete lifecycle of customer issues.

---

## 📖 Project Overview

Customer Relationship Management (CRM) is a system that helps organizations efficiently manage customer interactions and support requests.

This project focuses on complaint management where:

- Customers can raise support tickets.
- Engineers can work on assigned tickets.
- Admins can manage users and assign engineers.
- Every complaint goes through different stages until it is resolved.

The application follows REST API principles and uses JWT-based authentication and role-based authorization.

---

## 🎯 Objectives

- Build scalable REST APIs
- Implement Authentication & Authorization
- Manage customer complaints
- Track ticket lifecycle
- Assign engineers to tickets
- Maintain secure user management
- Learn backend architecture using Express and MongoDB

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose ODM

### Authentication

- JWT (JSON Web Token)
- Bcrypt

### API Testing

- Postman

### Environment Variables

- dotenv

### Development Tools

- Nodemon
- Git
- GitHub

---

# 📂 Project Structure

```
CRM-Application
│
├── configs/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── validators/
├── server.js
├── package.json
├── .env
└── README.md
```

---

# 👥 User Roles

There are three types of users.

## 1. Customer

- Register/Login
- Raise complaints
- View own tickets
- Track ticket status
- Update profile

---

## 2. Engineer

- View assigned tickets
- Accept tickets
- Update ticket status
- Resolve customer issues

---

## 3. Admin

- Manage users
- Create engineers
- Assign engineers
- View all tickets
- Update ticket priorities
- Manage ticket lifecycle

---

# 🎫 Ticket Lifecycle

```
OPEN
   │
   ▼
ASSIGNED
   │
   ▼
IN_PROGRESS
   │
   ▼
RESOLVED
   │
   ▼
CLOSED
```

---

# 🔐 Authentication

The application uses JWT authentication.

Features:

- User Signup
- User Login
- Password Hashing using Bcrypt
- JWT Token Generation
- Protected Routes
- Role Based Access Control (RBAC)

---

# 📌 Main Features

## User Management

- User Registration
- Login
- Authentication
- Authorization
- Profile Management

---

## Complaint Management

- Create Ticket
- Update Ticket
- Delete Ticket
- View Ticket
- Search Ticket
- Filter Tickets

---

## Engineer Management

- Assign Tickets
- Update Status
- Resolve Issues
- Track Assigned Tickets

---

## Admin Management

- Create Engineers
- View All Users
- Assign Tickets
- Manage Priorities
- Monitor System

---

# 📡 REST API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/v1/auth/signup | Register User |
| POST | /api/v1/auth/signin | Login |

---

## Users

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/users |
| GET | /api/v1/users/:id |
| PUT | /api/v1/users/:id |

---

## Tickets

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/tickets |
| GET | /api/v1/tickets |
| GET | /api/v1/tickets/:id |
| PUT | /api/v1/tickets/:id |
| DELETE | /api/v1/tickets/:id |

---

## Engineers

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/engineers |
| PUT | /api/v1/engineers/:id |

---

# 🗄 Database Models

### User

- Name
- Email
- Password
- User Type
- User Status

---

### Ticket

- Title
- Description
- Ticket Priority
- Ticket Status
- Reporter
- Assignee
- Created At
- Updated At

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/crm-application.git
```

Move into project

```bash
cd crm-application
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
PORT=7070

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Start server

```bash
npm start
```

For development

```bash
npm run dev
```

---

# 🧪 API Testing

Use **Postman** or **Thunder Client** to test all REST APIs.

Example:

```
POST /api/v1/auth/signup
```

```
POST /api/v1/auth/signin
```

```
POST /api/v1/tickets
```

---

# 🔒 Security Features

- Password Hashing
- JWT Authentication
- Protected Routes
- Role Based Authorization
- Environment Variables
- Request Validation

---

# 🚀 Future Enhancements

- Email Notifications
- File Attachments
- Dashboard Analytics
- Ticket Comments
- Activity Logs
- Swagger API Documentation
- Docker Support
- CI/CD Pipeline
- Unit Testing
- Redis Caching

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 👨‍💻 Author

**Vipin**

Backend Developer

---

# ⭐ Show Your Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.
