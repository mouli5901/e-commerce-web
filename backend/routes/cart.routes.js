const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
} = require("../controllers/cart.controller");

// Add product to cart
router.post("/:productId", protect, addToCart);

// Get current user's cart
router.get("/", protect, getCart);

// Update quantity of product in cart
router.patch("/:productId", protect, updateQuantity);

// Remove product from cart
router.delete("/:productId", protect, removeFromCart);

module.exports = router;
