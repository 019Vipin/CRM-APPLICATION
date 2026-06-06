const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "EMAIL"
    },
    status: {
        type: String,
        enum: ["PENDING", "SENT", "FAILED"],
        default: "PENDING"
    },
    retryCount: {
        type: Number,
        default: 0
    },
    lastError: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Notification", notificationSchema);
