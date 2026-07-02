const userController = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.get("/crm/api/v1/users", [authJwt.verifyToken, authJwt.isAdmin], userController.findAll);
    app.get("/crm/api/v1/users/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.findById);
    app.put("/crm/api/v1/users/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.update);
};
