const User = require("../models/user.model");
const constants = require("../utils/constants");

const validateUserRequestBody = async (req, res, next) => {

    // Validate name
    if (!req.body.name) {
        return res.status(400).send({
            message: "Failed! Name field is missing."
        });
    }

    // Validate password
    if (!req.body.password) {
        return res.status(400).send({
            message: "Failed! Password field is missing."
        });
    }

    // Validate userId
    if (!req.body.userId) {
        return res.status(400).send({
            message: "Failed! UserId field is missing."
        });
    }

    // Check if userId already exists
    const existingUser = await User.findOne({
        userId: req.body.userId
    });

    if (existingUser) {
        return res.status(400).send({
            message: "UserId is already registered."
        });
    }

    // Validate email
    if (!req.body.email) {
        return res.status(400).send({
            message: "Failed! Email field is missing."
        });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
        email: req.body.email
    });

    if (existingEmail) {
        return res.status(400).send({
            message: "Email is already registered."
        });
    }

    // Validate userType
    const possibleUserTypes = [
        constants.userTypes.customer,
        constants.userTypes.engineer,
        constants.userTypes.admin
    ];

    if (
        req.body.userType &&
        !possibleUserTypes.includes(req.body.userType)
    ) {
        return res.status(400).send({
            message: "Invalid userType passed."
        });
    }

    next();
};

module.exports = {
    validateUserReqBody: validateUserRequestBody
};