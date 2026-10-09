const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  createPaymentOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order.controller");

// Create pending order & Razorpay order
router.post("/create-payment-order", protect, createPaymentOrder);
router.post("/", protect, createPaymentOrder);

// Verify Razorpay payment signature & confirm order
router.post("/verify-payment", protect, verifyPayment);

// Get current user's orders
router.get("/", protect, getMyOrders);
router.get("/my-orders", protect, getMyOrders);

// Single order details (protected with ownership check)
router.get("/:id", protect, getOrderById);

// Bonus: Update order status progression
router.patch("/:id/status", protect, updateOrderStatus);

module.exports = router;
