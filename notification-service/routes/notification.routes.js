const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// POST /notifications — Queue a new notification
router.post("/", notificationController.raiseNotification);

// GET /notifications — Get all notifications (optionally filter by ticketId)
router.get("/", notificationController.getNotificationsByTicket);

// GET /notifications/:id — Get status of specific notification
router.get("/:id", notificationController.getNotificationStatus);

module.exports = router;
