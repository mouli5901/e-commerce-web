const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Add product to cart
// @route   POST /cart/:productId
// @access  Protected
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: "Product is out of stock" });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Quantity cannot exceed product stock",
        });
      }
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    await user.save();
    await user.populate({
      path: "cart.product",
      select: "name price description category image stock",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get current user's cart
// @route   GET /cart
// @access  Protected
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Customer.findById(userId).populate({
      path: "cart.product",
      select: "name price description category image stock",
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      cart: user.cart || [],
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update product quantity in cart
// @route   PATCH /cart/:productId
// @access  Protected
const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    if (quantity === undefined || quantity === null || typeof quantity !== "number" || isNaN(quantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a number" });
    }

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot exceed product stock",
      });
    }

    cartItem.quantity = quantity;
    await user.save();
    await user.populate({
      path: "cart.product",
      select: "name price description category image stock",
    });

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Update quantity error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Remove product from cart
// @route   DELETE /cart/:productId
// @access  Protected
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const index = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    user.cart.splice(index, 1);
    await user.save();
    await user.populate({
      path: "cart.product",
      select: "name price description category image stock",
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
};
