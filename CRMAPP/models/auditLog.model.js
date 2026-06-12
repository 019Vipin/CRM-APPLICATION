const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    actorId: {
        type: String,
        required: true,
        description: "userId of the person who performed the action"
    },
    action: {
        type: String,
        required: true,
        enum: [
            "USER_SIGNUP",
            "USER_LOGIN",
            "USER_STATUS_UPDATED",
            "USER_ROLE_UPDATED",
            "TICKET_CREATED",
            "TICKET_UPDATED",
            "TICKET_ASSIGNED",
            "TICKET_STATUS_CHANGED"
        ]
    },
    targetId: {
        type: String,
        description: "ID of the affected resource (userId, ticketId, etc.)"
    },
    targetType: {
        type: String,
        enum: ["USER", "TICKET"],
        description: "Type of the affected resource"
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        description: "Before/after state or extra context"
    }
}, {
    timestamps: true,
    versionKey: false
});

// Auto-expire logs after 90 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
