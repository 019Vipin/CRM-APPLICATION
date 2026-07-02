const AuditLog = require("../models/auditLog.model");

/**
 * Creates an audit log entry.
 * Non-blocking — errors are caught and logged but do not affect the request lifecycle.
 *
 * @param {string} actorId    - userId of the actor
 * @param {string} action     - one of the AuditLog.action enum values
 * @param {string} targetId   - ID of affected resource
 * @param {string} targetType - "USER" | "TICKET"
 * @param {object} details    - optional before/after or context object
 */
const log = async (actorId, action, targetId, targetType, details = {}) => {
    try {
        await AuditLog.create({ actorId, action, targetId, targetType, details });
    } catch (err) {
        console.error("[AuditLog] Failed to write audit entry:", err.message);
    }
};

module.exports = { log };
