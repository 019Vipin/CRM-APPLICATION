const User = require("../models/user.model");
const objectConverter = require("../utils/objectConverter");
const auditLogger = require("../utils/auditLogger");


exports.findAll = async (req, res) => {
    const userTypeReq = req.query.userType;
    const userStatusReq = req.query.userStatus;
    const userNameReq = req.query.name;

    let userObj;
    if (userTypeReq && userStatusReq) {
        userObj = { userType: userTypeReq, userStatus: userStatusReq };
    } else if (userTypeReq) {
        userObj = { userType: userTypeReq };
    } else if (userStatusReq) {
        userObj = { userStatus: userStatusReq };
    } else if (userNameReq) {
        userObj = { name: userNameReq };
    } else {
        userObj = {};
    }

    try {
        const users = await User.find(userObj);
        res.status(200).send(objectConverter.userResponse(users));
    } catch (err) {
        console.log("Error while fetching users", err);
        res.status(500).send({ message: "Internal server error while fetching users" });
    }
};

exports.findById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(objectConverter.userResponse([user])[0]);
    } catch (err) {
        console.log("Error while fetching user", err);
        res.status(500).send({ message: "Internal server error while fetching user" });
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        user.name = req.body.name != undefined ? req.body.name : user.name;
        user.userStatus = req.body.userStatus != undefined ? req.body.userStatus : user.userStatus;
        user.userType = req.body.userType != undefined ? req.body.userType : user.userType;

        const updatedUser = await user.save();

        // Log admin action
        if (req.body.userStatus) {
            await auditLogger.log(req.userId, "USER_STATUS_UPDATED", updatedUser.userId, "USER", {
                newStatus: updatedUser.userStatus
            });
        }
        if (req.body.userType) {
            await auditLogger.log(req.userId, "USER_ROLE_UPDATED", updatedUser.userId, "USER", {
                newRole: updatedUser.userType
            });
        }

        res.status(200).send({
            name: updatedUser.name,
            userId: updatedUser.userId,
            email: updatedUser.email,
            userType: updatedUser.userType,
            userStatus: updatedUser.userStatus
        });
    } catch (err) {
        console.log("Error while updating user", err);
        res.status(500).send({ message: "Internal server error while updating user" });
    }
};
