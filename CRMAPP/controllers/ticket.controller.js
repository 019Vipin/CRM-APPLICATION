const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const constants = require("../utils/constants");
const objectConverter = require("../utils/objectConverter");
const { publishTicketEvent } = require("../config/redis");

exports.createTicket = async (req, res) => {
    const ticketObject = {
        title: req.body.title,
        ticketPriority: req.body.ticketPriority,
        description: req.body.description,
        status: req.body.status,
        reporter: req.userId // from authJwt middleware
    };

    // Auto assignment logic
    const engineer = await User.findOne({
        userType: constants.userTypes.engineer,
        userStatus: constants.userStatuses.approved
    });

    if (engineer) {
        ticketObject.assignee = engineer.userId;
    }

    try {
        const ticket = await Ticket.create(ticketObject);
        if (ticket) {
            // Need to update the customer and engineer user document
            const user = await User.findOne({ userId: req.userId });
            user.ticketsCreated.push(ticket._id);
            await user.save();

            if (engineer) {
                engineer.ticketsAssigned.push(ticket._id);
                await engineer.save();
            }

            // Publish event to Redis notification queue
            await publishTicketEvent({
                eventType: "TICKET_CREATED",
                ticketId: ticket._id.toString(),
                customerEmail: user.email,
                engineerEmail: engineer ? engineer.email : null,
                timestamp: new Date().toISOString()
            });

            res.status(201).send(objectConverter.ticketResponse(ticket));
        }
    } catch (err) {
        console.log("Error while creating ticket", err);
        res.status(500).send({
            message: "Internal server error while creating ticket"
        });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ _id: req.params.id });

        if (!ticket) {
            return res.status(404).send({ message: "Ticket not found" });
        }

        const user = await User.findOne({ userId: req.userId });

        // Check if user has permission to update this ticket
        if (
            ticket.reporter === req.userId ||
            ticket.assignee === req.userId ||
            user.userType === constants.userTypes.admin
        ) {
            ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
            ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
            ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
            ticket.status = req.body.status != undefined ? req.body.status : ticket.status;
            ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;

            const updatedTicket = await ticket.save();

            // Publish event to Redis notification queue
            const reporter = await User.findOne({ userId: ticket.reporter });
            const assignee = ticket.assignee ? await User.findOne({ userId: ticket.assignee }) : null;
            await publishTicketEvent({
                eventType: "TICKET_UPDATED",
                ticketId: ticket._id.toString(),
                customerEmail: reporter ? reporter.email : null,
                engineerEmail: assignee ? assignee.email : null,
                timestamp: new Date().toISOString()
            });

            res.status(200).send(objectConverter.ticketResponse(updatedTicket));
        } else {
            return res.status(403).send({
                message: "Only the owner, assigned engineer, or admin can update this ticket."
            });
        }
    } catch (err) {
        console.log("Error while updating ticket", err);
        res.status(500).send({
            message: "Internal server error while updating ticket"
        });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.userId });
        let queryObj = {};

        if (user.userType === constants.userTypes.customer) {
            if (!user.ticketsCreated) {
                return res.status(200).send([]);
            }
            queryObj = { _id: { $in: user.ticketsCreated } };
        } else if (user.userType === constants.userTypes.engineer) {
            queryObj = { assignee: req.userId };
        }
        
        // Admin gets all tickets if no specific query

        const tickets = await Ticket.find(queryObj);
        res.status(200).send(objectConverter.ticketListResponse(tickets));
    } catch (err) {
        console.log("Error while fetching tickets", err);
        res.status(500).send({
            message: "Internal server error while fetching tickets"
        });
    }
};

exports.getOneTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ _id: req.params.id });
        if (!ticket) {
            return res.status(404).send({ message: "Ticket not found" });
        }
        res.status(200).send(objectConverter.ticketResponse(ticket));
    } catch (err) {
        console.log("Error while fetching ticket", err);
        res.status(500).send({
            message: "Internal server error while fetching ticket"
        });
    }
};
