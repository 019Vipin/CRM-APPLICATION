const Redis = require("ioredis");

let client = null;

const getClient = () => {
    if (!client) {
        client = new Redis({
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: parseInt(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            retryStrategy: (times) => {
                const delay = Math.min(times * 100, 3000);
                console.log(`[Redis] Retrying connection in ${delay}ms...`);
                return delay;
            }
        });

        client.on("connect", () => console.log("[Redis] Connected successfully"));
        client.on("error", (err) => console.error("[Redis] Error:", err.message));
    }
    return client;
};

/**
 * Push a notification event to the Redis queue
 */
const QUEUE_NAME = process.env.REDIS_QUEUE || "crm:notifications";

const pushToQueue = async (eventPayload) => {
    const redis = getClient();
    await redis.lpush(QUEUE_NAME, JSON.stringify(eventPayload));
    console.log(`[Redis] Event pushed to queue: ${eventPayload.eventType} for ticket ${eventPayload.ticketId}`);
};

/**
 * Pop a notification event from the Redis queue (blocking pop with timeout)
 */
const popFromQueue = async () => {
    const redis = getClient();
    const result = await redis.rpop(QUEUE_NAME);
    return result ? JSON.parse(result) : null;
};

module.exports = { getClient, pushToQueue, popFromQueue, QUEUE_NAME };
