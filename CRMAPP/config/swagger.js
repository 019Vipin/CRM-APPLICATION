const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "CRM Ticket Management & Notification API",
        version: "1.0.0",
        description: "Backend API for a CRM platform supporting customer ticket creation, engineer workflows, admin controls, and event-driven email notifications via Redis."
    },
    servers: [
        { url: "http://localhost:7777", description: "CRM Service" },
        { url: "http://localhost:8888", description: "Notification Service" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "apiKey",
                in: "header",
                name: "x-access-token",
                description: "JWT token obtained from /auth/signin"
            }
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    name: { type: "string", example: "John Doe" },
                    userId: { type: "string", example: "john123" },
                    email: { type: "string", example: "john@example.com" },
                    userType: { type: "string", enum: ["CUSTOMER", "ENGINEER", "ADMIN"] },
                    userStatus: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED", "BLOCKED"] }
                }
            },
            Ticket: {
                type: "object",
                properties: {
                    id: { type: "string", example: "64a1b2c3d4e5f6789012abcd" },
                    title: { type: "string", example: "Login page broken" },
                    description: { type: "string", example: "Cannot log in with valid credentials" },
                    ticketPriority: { type: "integer", minimum: 1, maximum: 4, example: 2 },
                    status: { type: "string", enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED", "REOPENED"] },
                    category: { type: "string", example: "BUG" },
                    reporter: { type: "string", example: "john123" },
                    assignee: { type: "string", example: "eng001" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            Notification: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    ticketId: { type: "string" },
                    eventType: { type: "string", enum: ["TICKET_CREATED", "TICKET_UPDATED", "TICKET_ASSIGNED", "TICKET_RESOLVED", "TICKET_CLOSED"] },
                    recipient: { type: "string" },
                    type: { type: "string", example: "EMAIL" },
                    status: { type: "string", enum: ["PENDING", "SENT", "FAILED"] },
                    retryCount: { type: "integer" }
                }
            },
            Error: {
                type: "object",
                properties: {
                    message: { type: "string" }
                }
            }
        }
    },
    security: [{ bearerAuth: [] }],
    paths: {
        "/crm/api/v1/auth/signup": {
            post: {
                tags: ["Authentication"],
                summary: "Register a new user",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "userId", "email", "password"],
                                properties: {
                                    name: { type: "string", example: "John Doe" },
                                    userId: { type: "string", example: "john123" },
                                    email: { type: "string", example: "john@example.com" },
                                    password: { type: "string", example: "password123" },
                                    userType: { type: "string", enum: ["CUSTOMER", "ENGINEER", "ADMIN"], default: "CUSTOMER" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "User created", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
                    400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
                }
            }
        },
        "/crm/api/v1/auth/signin": {
            post: {
                tags: ["Authentication"],
                summary: "Login and get JWT token",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string", example: "john@example.com" },
                                    password: { type: "string", example: "password123" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Successful login",
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: [
                                        { $ref: "#/components/schemas/User" },
                                        { type: "object", properties: { accessToken: { type: "string" } } }
                                    ]
                                }
                            }
                        }
                    },
                    400: { description: "Invalid email" },
                    401: { description: "Invalid password" },
                    403: { description: "Account not approved" }
                }
            }
        },
        "/crm/api/v1/users": {
            get: {
                tags: ["Users (Admin)"],
                summary: "Get all users (Admin only)",
                parameters: [
                    { name: "userType", in: "query", schema: { type: "string", enum: ["CUSTOMER", "ENGINEER", "ADMIN"] } },
                    { name: "userStatus", in: "query", schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED", "BLOCKED"] } },
                    { name: "name", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "List of users", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
                    403: { description: "Forbidden - Admin only" }
                }
            }
        },
        "/crm/api/v1/users/{id}": {
            get: {
                tags: ["Users (Admin)"],
                summary: "Get user by ID (Admin only)",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "userId field" }],
                responses: {
                    200: { description: "User found", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
                    404: { description: "User not found" }
                }
            },
            put: {
                tags: ["Users (Admin)"],
                summary: "Update user status or role (Admin only)",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    userStatus: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED", "BLOCKED"] },
                                    userType: { type: "string", enum: ["CUSTOMER", "ENGINEER", "ADMIN"] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "User updated" },
                    404: { description: "User not found" }
                }
            }
        },
        "/crm/api/v1/tickets": {
            post: {
                tags: ["Tickets"],
                summary: "Create a new ticket (Customer)",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "description"],
                                properties: {
                                    title: { type: "string", example: "Login page broken" },
                                    description: { type: "string", example: "Cannot log in with valid credentials" },
                                    ticketPriority: { type: "integer", minimum: 1, maximum: 4, default: 4 },
                                    status: { type: "string", default: "OPEN" },
                                    category: { type: "string", example: "BUG" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Ticket created", content: { "application/json": { schema: { $ref: "#/components/schemas/Ticket" } } } }
                }
            },
            get: {
                tags: ["Tickets"],
                summary: "Get tickets (scoped by role)",
                responses: {
                    200: { description: "List of tickets", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Ticket" } } } } }
                }
            }
        },
        "/crm/api/v1/tickets/{id}": {
            get: {
                tags: ["Tickets"],
                summary: "Get a single ticket by ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Ticket", content: { "application/json": { schema: { $ref: "#/components/schemas/Ticket" } } } },
                    404: { description: "Ticket not found" }
                }
            },
            put: {
                tags: ["Tickets"],
                summary: "Update a ticket (owner, assignee, or admin)",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    ticketPriority: { type: "integer" },
                                    status: { type: "string" },
                                    assignee: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Updated ticket", content: { "application/json": { schema: { $ref: "#/components/schemas/Ticket" } } } }
                }
            }
        },
        "/crm/api/v1/tickets/search": {
            get: {
                tags: ["Tickets"],
                summary: "Search tickets (Engineer/Admin)",
                parameters: [
                    { name: "ticketId", in: "query", schema: { type: "string" } },
                    { name: "customerId", in: "query", schema: { type: "string" } },
                    { name: "status", in: "query", schema: { type: "string" } },
                    { name: "priority", in: "query", schema: { type: "integer" } },
                    { name: "category", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Search results", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Ticket" } } } } }
                }
            }
        },
        "/crm/api/v1/engineers/tickets": {
            get: {
                tags: ["Engineer"],
                summary: "Get all tickets assigned to me (Engineer)",
                responses: {
                    200: { description: "Assigned tickets", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Ticket" } } } } }
                }
            }
        },
        "/crm/api/v1/engineers/tickets/{id}": {
            put: {
                tags: ["Engineer"],
                summary: "Engineer updates ticket status or adds a comment",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", enum: ["IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED"] },
                                    description: { type: "string" },
                                    comment: { type: "string", example: "Investigated the issue, fix incoming." }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Ticket updated" } }
            }
        },
        "/crm/api/v1/engineers/tickets/{id}/assign": {
            put: {
                tags: ["Engineer"],
                summary: "Assign ticket to self or another engineer",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    engineerId: { type: "string", description: "Leave empty to assign to yourself" }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Ticket assigned" } }
            }
        },
        "/crm/api/v1/admin/customers": {
            get: {
                tags: ["Admin"],
                summary: "Get all customers (Admin only)",
                responses: {
                    200: { description: "List of customers", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } }
                }
            }
        },
        "/crm/api/v1/admin/issues": {
            get: {
                tags: ["Admin"],
                summary: "Get all tickets with filters (Admin only)",
                parameters: [
                    { name: "status", in: "query", schema: { type: "string" } },
                    { name: "assignee", in: "query", schema: { type: "string" } },
                    { name: "priority", in: "query", schema: { type: "integer" } },
                    { name: "category", in: "query", schema: { type: "string" } },
                    { name: "reporter", in: "query", schema: { type: "string" } },
                    { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
                    { name: "endDate", in: "query", schema: { type: "string", format: "date" } }
                ],
                responses: {
                    200: { description: "All tickets", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Ticket" } } } } }
                }
            }
        },
        "/notifications": {
            post: {
                tags: ["Notifications"],
                summary: "Queue a notification event",
                servers: [{ url: "http://localhost:8888" }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["eventType", "ticketId"],
                                properties: {
                                    eventType: { type: "string", enum: ["TICKET_CREATED", "TICKET_UPDATED", "TICKET_ASSIGNED", "TICKET_RESOLVED", "TICKET_CLOSED"] },
                                    ticketId: { type: "string" },
                                    customerEmail: { type: "string" },
                                    engineerEmail: { type: "string" },
                                    timestamp: { type: "string", format: "date-time" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    202: { description: "Notification queued" },
                    400: { description: "Invalid payload" }
                }
            },
            get: {
                tags: ["Notifications"],
                summary: "List notifications (filter by ticketId)",
                servers: [{ url: "http://localhost:8888" }],
                parameters: [{ name: "ticketId", in: "query", schema: { type: "string" } }],
                responses: {
                    200: { description: "Notification list", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Notification" } } } } }
                }
            }
        },
        "/notifications/{id}": {
            get: {
                tags: ["Notifications"],
                summary: "Get notification delivery status",
                servers: [{ url: "http://localhost:8888" }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Notification status", content: { "application/json": { schema: { $ref: "#/components/schemas/Notification" } } } },
                    404: { description: "Not found" }
                }
            }
        }
    }
};

module.exports = swaggerDefinition;
