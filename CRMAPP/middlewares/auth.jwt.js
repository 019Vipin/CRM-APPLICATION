const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const constants = require("../utils/constants");

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, process.env.SECRET || "mySuperSecretKey", (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ userId: req.userId });
        if (user && user.userType === constants.userTypes.admin) {
            next();
        } else {
            return res.status(403).send({
                message: "Require Admin Role!"
            });
        }
    } catch (err) {
        return res.status(500).send({
            message: "Internal error while checking admin role"
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};
