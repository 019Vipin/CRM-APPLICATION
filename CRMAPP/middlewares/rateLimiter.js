const rateLimit = require("express-rate-limit");

/**
 * General API rate limiter — 100 requests per 15 minutes
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests from this IP, please try again after 15 minutes."
    }
});

/**
 * Stricter limiter for auth endpoints — 10 attempts per 15 minutes
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many login/signup attempts from this IP, please try again after 15 minutes."
    }
});

module.exports = { generalLimiter, authLimiter };
