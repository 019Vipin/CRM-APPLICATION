const cron = require("node-cron");
const Notification = require("../models/notification.model");
const emailService = require("../services/email.service");
const { popFromQueue } = require("../config/redis");

const MAX_RETRIES = 3;

/**
 * Process a single notification event from Redis queue
 */
const processQueuedEvent = async () => {
    const event = await popFromQueue();
    if (!event) return;

    console.log(`[Scheduler] Processing event: ${event.eventType} for ticket ${event.ticketId}`);

    const recipients = [];

    // Determine who to notify based on event type
    switch (event.eventType) {
        case "TICKET_CREATED":
            if (event.customerEmail) recipients.push(event.customerEmail);
            if (event.engineerEmail) recipients.push(event.engineerEmail);
            break;
        case "TICKET_ASSIGNED":
            if (event.engineerEmail) recipients.push(event.engineerEmail);
            break;
        case "TICKET_UPDATED":
            if (event.customerEmail) recipients.push(event.customerEmail);
            if (event.engineerEmail) recipients.push(event.engineerEmail);
            break;
        case "TICKET_RESOLVED":
        case "TICKET_CLOSED":
            if (event.customerEmail) recipients.push(event.customerEmail);
            break;
        default:
            if (event.customerEmail) recipients.push(event.customerEmail);
    }

    const { subject, body } = emailService.buildEmailContent(event);

    for (const recipient of recipients) {
        // Create a PENDING notification record in DB
        const notification = await Notification.create({
            ticketId: event.ticketId,
            eventType: event.eventType,
            recipient,
            status: "PENDING"
        });

        try {
            await emailService.sendEmail({ to: recipient, subject, body });
            notification.status = "SENT";
            await notification.save();
        } catch (err) {
            console.error(`[Scheduler] Failed to send email to ${recipient}:`, err.message);
            notification.status = "FAILED";
            notification.lastError = err.message;
            notification.retryCount += 1;
            await notification.save();
        }
    }
};

/**
 * Retry failed notifications (up to MAX_RETRIES)
 */
const retryFailedNotifications = async () => {
    const failedNotifications = await Notification.find({
        status: "FAILED",
        retryCount: { $lt: MAX_RETRIES }
    });

    if (failedNotifications.length === 0) return;

    console.log(`[Scheduler] Retrying ${failedNotifications.length} failed notification(s)...`);

    for (const notification of failedNotifications) {
        const { subject, body } = emailService.buildEmailContent({
            eventType: notification.eventType,
            ticketId: notification.ticketId
        });

        try {
            await emailService.sendEmail({
                to: notification.recipient,
                subject,
                body
            });
            notification.status = "SENT";
            await notification.save();
            console.log(`[Scheduler] Retry successful for notification ${notification._id}`);
        } catch (err) {
            notification.retryCount += 1;
            notification.lastError = err.message;
            if (notification.retryCount >= MAX_RETRIES) {
                console.error(`[Scheduler] Notification ${notification._id} exceeded max retries. Moving to dead-letter.`);
            }
            await notification.save();
        }
    }
};

/**
 * Start the background scheduler
 * - Every 10 seconds: drain the Redis queue
 * - Every 5 minutes: retry failed notifications
 */
const startScheduler = () => {
    console.log("[Scheduler] Starting background notification scheduler...");

    // Poll Redis queue every 10 seconds
    cron.schedule("*/10 * * * * *", async () => {
        try {
            // Drain the queue
            let hasMore = true;
            while (hasMore) {
                const before = Date.now();
                await processQueuedEvent();
                const elapsed = Date.now() - before;
                // If processing was near-instant, likely nothing left
                if (elapsed < 50) hasMore = false;
            }
        } catch (err) {
            console.error("[Scheduler] Error processing queue:", err.message);
        }
    });

    // Retry failed notifications every 5 minutes
    cron.schedule("*/5 * * * *", async () => {
        try {
            await retryFailedNotifications();
        } catch (err) {
            console.error("[Scheduler] Error retrying failed notifications:", err.message);
        }
    });

    console.log("[Scheduler] Scheduler started.");
};

module.exports = { startScheduler };
