const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const constants = require("../utils/constants");
const jwt = require("jsonwebtoken");

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

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ message: "Failed! Email passed doesn't exist" });
        }

        if (user.userStatus !== constants.userStatuses.approved) {
            return res.status(403).send({ message: "Can't allow login as user is in status: " + user.userStatus });
        }

        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid Password!" });
        }

        const token = jwt.sign({ id: user.userId }, process.env.SECRET || "mySuperSecretKey", {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            userStatus: user.userStatus,
            accessToken: token
        });

    } catch (err) {
        console.log("Error while user signin", err);
        res.status(500).send({ message: "Internal server error while signin" });
    }
};