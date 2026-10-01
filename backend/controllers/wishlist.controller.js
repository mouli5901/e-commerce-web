const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Add product to wishlist
// @route   POST /wishlist/:productId
// @access  Protected
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Prevent duplicates
    if (user.wishlist.includes(productId)) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();
    return res.status(200).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current user's wishlist
// @route   GET /wishlist
// @access  Protected
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Customer.findById(userId).populate({
      path: 'wishlist',
      select: 'name price category image stock',
    });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    const wishlistProducts = user.wishlist;
    return res.status(200).json({
      success: true,
      count: wishlistProducts.length,
      wishlist: wishlistProducts,
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /wishlist/:productId
// @access  Protected
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not in wishlist' });
    }

    user.wishlist.splice(index, 1);
    await user.save();
    return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
