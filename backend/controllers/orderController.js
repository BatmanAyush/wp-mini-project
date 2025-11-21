const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const verifyToken = require("../middlewares/auth");
const orderController = require("express").Router();

// 1. CREATE ORDER & GENERATE NOTIFICATIONS
orderController.post("/", verifyToken, async (req, res) => {
  try {
    // A. Create the Order Record
    const newOrder = await Order.create({
        userId: req.user.id, // Customer ID
        products: req.body.products,
        amount: req.body.amount,
        address: req.body.address,
        status: "pending"
    });
    await newOrder.save();

    // B. The Notification Logic
    // We need to notify the vendor of EACH product bought
    // (Using a Set to avoid spamming if user bought 3 items from same vendor)
    
    const vendorIds = new Set();

    // 1. Collect unique Vendor IDs from the products purchased
    // Note: Frontend must pass 'vendorId' inside the products array, 
    // OR we fetch it here. Fetching here is safer:
    for (const item of req.body.products) {
        const product = await Product.findById(item.productId);
        if(product && product.vendorId) {
            vendorIds.add(product.vendorId.toString());
        }
    }

    // 2. Create a Notification for each unique Vendor
    const notificationPromises = Array.from(vendorIds).map(vendorId => {
        return Notification.create({
            recipientId: vendorId,        // The Vendor
            senderId: req.user.id,        // The Customer
            orderId: newOrder._id,
            message: `You have a new order from ${req.body.username || 'a customer'}!`,
            isRead: false
        });
    });

    await Promise.all(notificationPromises);

    return res.status(200).json(newOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// ... (Keep your other get/delete routes for now)

module.exports = orderController;