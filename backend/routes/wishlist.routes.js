const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');

// Add product to wishlist
router.post('/:productId', protect, addToWishlist);

// Get current user's wishlist
router.get('/', protect, getWishlist);

// Remove product from wishlist
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
