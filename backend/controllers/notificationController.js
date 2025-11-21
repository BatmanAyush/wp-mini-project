const Notification = require("../models/Notification");
const verifyToken = require("../middlewares/auth");
const notificationController = require("express").Router();

// GET MY NOTIFICATIONS (Vendor Dashboard)
notificationController.get("/", verifyToken, async (req, res) => {
    try {
        // Only fetch notifications meant for THIS user (the vendor)
        const notifications = await Notification.find({ recipientId: req.user.id })
            .sort({ createdAt: -1 }) // Newest first
            .populate("senderId", "username email") // Get customer details
            .populate("orderId"); // Get order details

        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// MARK AS READ
notificationController.put("/:id", verifyToken, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, 
            { isRead: true }, 
            { new: true }
        );
        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = notificationController;