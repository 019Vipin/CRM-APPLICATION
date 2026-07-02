/**
 * CRM Application - Main Entry Point
 * 1. Start Express server with middleware
 * 2. Connect to MongoDB and seed default admin
 * 3. Register all route modules
 * 4. Mount Swagger UI for API documentation
 */

require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./config/swagger");
const { generalLimiter, authLimiter } = require("./middlewares/rateLimiter");

/**
 * Core Middleware
 */
app.use(express.json());
app.use(cors());

/**
 * Apply general rate limiter to all routes
 */
app.use(generalLimiter);

/**
 * Swagger API Documentation at /api-docs
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition, {
    customSiteTitle: "CRM API Docs",
    customCss: ".swagger-ui .topbar { background-color: #1a1a2e; }"
}));

/**
 * Health check
 */
app.get("/health", (req, res) => {
    res.status(200).send({ status: "UP", service: "crm-service", timestamp: new Date().toISOString() });
});

/**
 * Make a connection with MongoDB and seed default admin
 */
(async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crm"
        );
        console.log("[CRM] MongoDB Connected");

        const existingAdmin = await User.findOne({ userId: "admin" });
        if (!existingAdmin) {
            console.log("[CRM] Admin not found — creating default admin...");
            const admin = await User.create({
                name: "Vipin",
                userId: "admin",
                email: "vipinkr0818@gmail.com",
                userType: "ADMIN",
                userStatus: "APPROVED",
                password: bcrypt.hashSync("welcome1", 8)
            });
            console.log("[CRM] Default admin created:", admin.userId);
        } else {
            console.log("[CRM] Admin user already exists.");
        }
    } catch (err) {
        console.error("[CRM] Startup Error:", err.message);
    }
})();

/**
 * Auth routes (with stricter rate limiting on login/signup)
 */
const authRoute = require("./routes/auth.routes");
app.use("/crm/api/v1", authLimiter, authRoute);

/**
 * Feature routes
 */
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);
require("./routes/engineer.routes")(app);
require("./routes/admin.routes")(app);

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).send({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    console.error("[CRM] Unhandled error:", err.message);
    res.status(500).send({ message: "Internal server error" });
});

/**
 * Start the Express Server
 */
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
    console.log(`[CRM] Server running on port ${PORT}`);
    console.log(`[CRM] API Docs available at http://localhost:${PORT}/api-docs`);
});