const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const constants = require("../utils/constants");

/**
 * Verify token and check if user is an engineer
 */
const isEngineer = async (req, res, next) => {
    try {
        const user = await User.findOne({ userId: req.userId });
        if (user && (user.userType === constants.userTypes.engineer || user.userType === constants.userTypes.admin)) {
            next();
        } else {
            return res.status(403).send({ message: "Require Engineer Role!" });
        }
    } catch (err) {
        return res.status(500).send({ message: "Internal error while checking engineer role" });
    }
};

module.exports = { isEngineer };
