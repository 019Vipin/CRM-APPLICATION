const express = require("express");
const route=express.Router();
const authController = require("../controllers/auth.controller")


route.post("/auth/signup",authController.signup);

module.exports=route;