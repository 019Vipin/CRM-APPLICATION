const Notification = require("../models/notification.model");
const { pushToQueue } = require("../config/redis");

/**
 * POST /notifications
 * CRM service sends a notification request payload
 */
exports.raiseNotification = async (req, res) => {
    const { eventType, ticketId, customerEmail, engineerEmail, timestamp } = req.body;

    if (!eventType || !ticketId) {
        return res.status(400).send({ message: "eventType and ticketId are required" });
    }

    try {
        // Push event to Redis queue for async processing
        await pushToQueue({
            eventType,
            ticketId,
            customerEmail,
            engineerEmail,
            timestamp: timestamp || new Date().toISOString()
        });

        res.status(202).send({ message: "Notification queued successfully", ticketId, eventType });
    } catch (err) {
        console.error("Error queuing notification:", err);
        res.status(500).send({ message: "Internal error while queuing notification" });
    }
};

/**
 * GET /notifications/:id
 * Returns delivery status of a notification
 */
exports.getNotificationStatus = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).send({ message: "Notification not found" });
        }
        res.status(200).send(notification);
    } catch (err) {
        console.error("Error fetching notification:", err);
        res.status(500).send({ message: "Internal error while fetching notification" });
    }
};

/**
 * GET /notifications?ticketId=xxx
 * Returns all notifications for a given ticket
 */
exports.getNotificationsByTicket = async (req, res) => {
    try {
        const { ticketId } = req.query;
        const query = ticketId ? { ticketId } : {};
        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.status(200).send(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).send({ message: "Internal error while fetching notifications" });
    }
};
