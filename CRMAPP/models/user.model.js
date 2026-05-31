const mongoose = require("mongoose");
const constants = require("../utils/constants");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 7
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 10
    },

    userType: {
        type: String,
        required: true,
        enum: [
            constants.userTypes.customer,
            constants.userTypes.admin,
            constants.userTypes.engineer
        ],
        default: constants.userTypes.customer
    },

    userStatus: {
        type: String,
        required: true,
        enum: [
            constants.userStatuses.approved,
            constants.userStatuses.pending,
            constants.userStatuses.blocked
        ],
        default: constants.userStatuses.approved
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);