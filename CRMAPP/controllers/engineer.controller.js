const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const constants = require("../utils/constants");
const objectConverter = require("../utils/objectConverter");
const { publishTicketEvent } = require("../config/redis");

/**
 * Get all tickets assigned to the logged-in engineer
 */
exports.getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ assignee: req.userId });
        res.status(200).send(objectConverter.ticketListResponse(tickets));
    } catch (err) {
        console.log("Error while fetching engineer tickets", err);
        res.status(500).send({ message: "Internal server error while fetching your tickets" });
    }
};

/**
 * Engineer updates ticket status, adds comments, adds resolution notes
 */
exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send({ message: "Ticket not found" });
        }

        if (ticket.assignee !== req.userId) {
            return res.status(403).send({ message: "You can only update tickets assigned to you" });
        }

        ticket.status = req.body.status != undefined ? req.body.status : ticket.status;
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description;

        if (req.body.comment) {
            ticket.comments.push({
                author: req.userId,
                text: req.body.comment,
                createdAt: new Date()
            });
        }

        const updatedTicket = await ticket.save();
        res.status(200).send(objectConverter.ticketResponse(updatedTicket));
    } catch (err) {
        console.log("Error while engineer updating ticket", err);
        res.status(500).send({ message: "Internal server error while updating ticket" });
    }
};

/**
 * Assign a ticket to self or another engineer
 */
exports.assignTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send({ message: "Ticket not found" });
        }

        const targetEngineer = req.body.engineerId || req.userId;

        // Validate target is an approved engineer
        const engineer = await User.findOne({
            userId: targetEngineer,
            userType: constants.userTypes.engineer,
            userStatus: constants.userStatuses.approved
        });

        if (!engineer) {
            return res.status(404).send({ message: "Target engineer not found or not approved" });
        }

        // Remove from old assignee's list if exists
        if (ticket.assignee) {
            await User.updateOne(
                { userId: ticket.assignee },
                { $pull: { ticketsAssigned: ticket._id } }
            );
        }

        ticket.assignee = targetEngineer;
        ticket.status = "ASSIGNED";
        await ticket.save();

        engineer.ticketsAssigned.push(ticket._id);
        await engineer.save();

        // Publish TICKET_ASSIGNED event
        const reporter = await User.findOne({ userId: ticket.reporter });
        await publishTicketEvent({
            eventType: "TICKET_ASSIGNED",
            ticketId: ticket._id.toString(),
            customerEmail: reporter ? reporter.email : null,
            engineerEmail: engineer.email,
            timestamp: new Date().toISOString()
        });

        res.status(200).send(objectConverter.ticketResponse(ticket));
    } catch (err) {
        console.log("Error while assigning ticket", err);
        res.status(500).send({ message: "Internal server error while assigning ticket" });
    }
};

/**
 * Search tickets by various filters (for engineers)
 */
exports.searchTickets = async (req, res) => {
    try {
        const { ticketId, customerId, status, priority, category } = req.query;
        let queryObj = {};

        if (ticketId) queryObj._id = ticketId;
        if (customerId) queryObj.reporter = customerId;
        if (status) queryObj.status = status;
        if (priority) queryObj.ticketPriority = priority;
        if (category) queryObj.category = category;

        const tickets = await Ticket.find(queryObj);
        res.status(200).send(objectConverter.ticketListResponse(tickets));
    } catch (err) {
        console.log("Error while searching tickets", err);
        res.status(500).send({ message: "Internal server error while searching tickets" });
    }
};
