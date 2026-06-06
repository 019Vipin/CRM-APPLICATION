require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { startScheduler } = require("./scheduler/notificationScheduler");
const notificationRoutes = require("./routes/notification.routes");

const app = express();
app.use(express.json());

/**
 * Health check
 */
app.get("/health", (req, res) => {
    res.status(200).send({ status: "UP", service: "notification-service" });
});

/**
 * Notification routes
 */
app.use("/notifications", notificationRoutes);

/**
 * Connect to MongoDB and start service
 */
const PORT = process.env.NOTIFICATION_PORT || 8888;

(async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crm"
        );
        console.log("[NotificationService] MongoDB connected");

        // Start the Redis queue scheduler
        startScheduler();

        app.listen(PORT, () => {
            console.log(`[NotificationService] Running on port ${PORT}`);
        });
    } catch (err) {
        console.error("[NotificationService] Startup error:", err.message);
        process.exit(1);
    }
})();
