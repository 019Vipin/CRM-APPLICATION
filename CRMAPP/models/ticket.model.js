const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ticketPriority: {
        type: Number,
        required: true,
        default: 4 // 1: highest, 4: lowest
    },
    status: {
        type: String,
        required: true,
        default: "OPEN",
        enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED", "REOPENED"]
    },
    category: {
        type: String,
        required: false
    },
    reporter: {
        type: String,
        required: true
    },
    assignee: {
        type: String
    },
    comments: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Ticket", ticketSchema);
