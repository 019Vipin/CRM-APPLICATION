const ticketController = require("../controllers/ticket.controller");
const { authJwt } = require("../middlewares");
const { validateTicketBody, validateTicketUpdate } = require("../middlewares/validateTicket");

module.exports = function(app) {
    // Create a new ticket (Customer — with validation)
    app.post(
        "/crm/api/v1/tickets",
        [authJwt.verifyToken, ...validateTicketBody],
        ticketController.createTicket
    );

    // Update a ticket (owner / assignee / admin)
    app.put(
        "/crm/api/v1/tickets/:id",
        [authJwt.verifyToken, ...validateTicketUpdate],
        ticketController.updateTicket
    );

    // Get all tickets (scoped by role)
    app.get(
        "/crm/api/v1/tickets",
        [authJwt.verifyToken],
        ticketController.getAllTickets
    );

    // Get single ticket
    app.get(
        "/crm/api/v1/tickets/:id",
        [authJwt.verifyToken],
        ticketController.getOneTicket
    );
};
