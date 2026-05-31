const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const constants = require("../utils/constants");

exports.signup = async (req, res) => {

    let userStatus;

    if (
        !req.body.userType ||
        req.body.userType === constants.userTypes.customer
    ) {
        userStatus = constants.userStatuses.approved;
    } else {
        userStatus = constants.userStatuses.pending;
    }

    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 8),
        userStatus: userStatus
    };

    try {

        const userCreated = await User.create(userObj);

        const postRes = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType: userCreated.userType,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt
        };

        return res.status(201).send(postRes);

    } catch (err) {

        console.log("Error while creating user", err);

        return res.status(500).send({
            message: "Some internal error while creating the user"
        });
    }
};