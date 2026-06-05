const engineerController = require("../controllers/engineer.controller");
const { authJwt, engineerAuth } = require("../middlewares");

module.exports = function(app) {
    // Get all tickets assigned to logged-in engineer
    app.get(
        "/crm/api/v1/engineers/tickets",
        [authJwt.verifyToken, engineerAuth.isEngineer],
        engineerController.getMyTickets
    );

    // Engineer updates a ticket
    app.put(
        "/crm/api/v1/engineers/tickets/:id",
        [authJwt.verifyToken, engineerAuth.isEngineer],
        engineerController.updateTicket
    );

    // Assign ticket to self or another engineer
    app.put(
        "/crm/api/v1/engineers/tickets/:id/assign",
        [authJwt.verifyToken, engineerAuth.isEngineer],
        engineerController.assignTicket
    );

    // Search tickets
    app.get(
        "/crm/api/v1/tickets/search",
        [authJwt.verifyToken, engineerAuth.isEngineer],
        engineerController.searchTickets
    );
};
