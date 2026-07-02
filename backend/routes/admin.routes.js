const adminController = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    // Get all customers
    app.get(
        "/crm/api/v1/admin/customers",
        [authJwt.verifyToken, authJwt.isAdmin],
        adminController.getAllCustomers
    );

    // Get all issues with optional filters
    app.get(
        "/crm/api/v1/admin/issues",
        [authJwt.verifyToken, authJwt.isAdmin],
        adminController.getAllIssues
    );
};
