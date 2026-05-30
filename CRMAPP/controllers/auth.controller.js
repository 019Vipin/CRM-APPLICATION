const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

/**
 * Logic to the signup – Customer ( A ) /Engineer ( P ) / Admin ( P )
 */

exports.signup = async (req, res) => {

    let userStatus = req.body.userStatus;

    if (!req.body.userType || req.body.userType == "CUSTOMER") {
        userStatus = "APPROVED";
    } else {
        userStatus = "PENDING";
    }

    //To store the user in the DB
    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 8),
        userStatus: userStatus
    }

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
        }
        res.status(201).send(postRes);
    } catch (err) {
        console.log('Error while creating user', err);
        res.status(500).send({
            message: "Some internal error while creating the user"
        })
    }
}