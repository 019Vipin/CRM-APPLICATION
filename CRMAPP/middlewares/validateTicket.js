const { body, validationResult } = require("express-validator");

/**
 * Middleware to return validation errors if any
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: "Validation failed",
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

/**
 * Validation rules for ticket creation
 */
const validateTicketBody = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 5, max: 200 }).withMessage("Title must be between 5 and 200 characters"),
    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
    body("ticketPriority")
        .optional()
        .isInt({ min: 1, max: 4 }).withMessage("Priority must be 1 (highest) to 4 (lowest)"),
    body("status")
        .optional()
        .isIn(["OPEN", "ASSIGNED", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED", "REOPENED"])
        .withMessage("Invalid ticket status"),
    handleValidationErrors
];

/**
 * Validation rules for ticket update (all fields optional)
 */
const validateTicketUpdate = [
    body("title")
        .optional()
        .isLength({ min: 5, max: 200 }).withMessage("Title must be between 5 and 200 characters"),
    body("ticketPriority")
        .optional()
        .isInt({ min: 1, max: 4 }).withMessage("Priority must be 1 to 4"),
    body("status")
        .optional()
        .isIn(["OPEN", "ASSIGNED", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED", "REOPENED"])
        .withMessage("Invalid ticket status"),
    handleValidationErrors
];

module.exports = { validateTicketBody, validateTicketUpdate, handleValidationErrors };
