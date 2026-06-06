const Redis = require("ioredis");

let client = null;

const getClient = () => {
    if (!client) {
        client = new Redis({
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: parseInt(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            retryStrategy: (times) => Math.min(times * 100, 3000)
        });
        client.on("connect", () => console.log("[CRM Redis] Connected"));
        client.on("error", (err) => console.error("[CRM Redis] Error:", err.message));
    }
    return client;
};

const QUEUE_NAME = process.env.REDIS_QUEUE || "crm:notifications";

/**
 * Publish a ticket event to the Redis notification queue
 */
const publishTicketEvent = async (payload) => {
    try {
        const redis = getClient();
        await redis.lpush(QUEUE_NAME, JSON.stringify(payload));
        console.log(`[CRM Redis] Event published: ${payload.eventType} → ticket ${payload.ticketId}`);
    } catch (err) {
        console.error("[CRM Redis] Failed to publish event:", err.message);
        // Non-blocking — CRM service continues even if Redis is down
    }
};

module.exports = { publishTicketEvent };
