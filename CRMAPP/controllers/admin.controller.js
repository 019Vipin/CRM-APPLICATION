const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const constants = require("../utils/constants");
const objectConverter = require("../utils/objectConverter");

/**
 * Get all customers
 */
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ userType: constants.userTypes.customer });
        res.status(200).send(objectConverter.userResponse(customers));
    } catch (err) {
        console.log("Error while fetching customers", err);
        res.status(500).send({ message: "Internal server error while fetching customers" });
    }
};

/**
 * Get all tickets in the system with optional filters
 */
exports.getAllIssues = async (req, res) => {
    try {
        const { status, assignee, priority, category, startDate, endDate, reporter } = req.query;
        let queryObj = {};

        if (status) queryObj.status = status;
        if (assignee) queryObj.assignee = assignee;
        if (priority) queryObj.ticketPriority = parseInt(priority);
        if (category) queryObj.category = category;
        if (reporter) queryObj.reporter = reporter;
        if (startDate || endDate) {
            queryObj.createdAt = {};
            if (startDate) queryObj.createdAt.$gte = new Date(startDate);
            if (endDate) queryObj.createdAt.$lte = new Date(endDate);
        }

        const tickets = await Ticket.find(queryObj);
        res.status(200).send(objectConverter.ticketListResponse(tickets));
    } catch (err) {
        console.log("Error while fetching all issues", err);
        res.status(500).send({ message: "Internal server error while fetching issues" });
    }
};
