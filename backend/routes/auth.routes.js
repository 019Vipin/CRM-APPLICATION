const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const verifyUserReqBody = require("../middlewares/verifyUserreqBody");

router.post(
    "/auth/signup",
    verifyUserReqBody.validateUserReqBody,
    authController.signup
);

router.post("/auth/signin", authController.signin);

module.exports = router;