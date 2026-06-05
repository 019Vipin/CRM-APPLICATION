/**
 * 1. Logic to start the Express server
 * 2. Make a connection to MongoDB and create an admin user at server boot time (if not already present)
 * 3. Connect to the route layer
 */

const express = require("express");
const app = express();

require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");

/**
 * Middleware to parse JSON request body
 */
app.use(express.json());

/**
 * Make a connection with MongoDB
 */
(async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crm"
        );

        console.log("Mongo Connected");

        /**
         * I need to have a default ADMIN created here from the beginning
         */
        const user = await User.findOne({
            userId: "admin"
        });
        if (!user) {
            console.log("Admin is not present");
            // Let's create a new ADMIN
            const admin = await User.create({
                name: "Vipin",
                userId: "admin",
                email: "vipinkr0818@gmail.com",
                userType: "ADMIN",
                userStatus: "APPROVED",
                password: bcrypt.hashSync("welcome1", 8)

            });

            console.log("Admin created :", admin);

        } else {

            console.log("Admin user is already present!");

        }

    } catch (err) {

        console.log("Error :", err);

    }

})();

/**
 * Let's stitch the auth routes
 */
const authRoute = require("./routes/auth.routes");
app.use("/crm/api/v1", authRoute);

require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);
require("./routes/engineer.routes")(app);
require("./routes/admin.routes")(app);

/**
 * Start the Express Server
 */
const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {

    console.log(`Server started running on port ${PORT}`);

});