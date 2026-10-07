import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [wishlistStatus, setWishlistStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleDetails = () => navigate(`/products/${product._id}`);

  const addToWishlist = async () => {
    if (wishlistStatus === 'loading') return;
    setWishlistStatus('loading');
    setErrorMessage('');
    try {
      const res = await API.post(`/wishlist/${product._id}`);
      if (res.data && res.data.success) {
        setWishlistStatus('success');
      } else {
        setWishlistStatus('error');
        setErrorMessage(res.data.message || 'Unable to save product.');
      }
    } catch (err) {
      setWishlistStatus('error');
      setErrorMessage(err.response?.data?.message || 'Unable to save product.');
    }
  };

  const wishlistLabel = {
    idle:    '♡ Wishlist',
    loading: '⏳ Saving…',
    success: '♥ Saved',
    error:   '♡ Retry',
  }[wishlistStatus];

  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-category-badge">{product.category}</span>
      </div>

      {/* Body */}
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>

        <div className="product-meta">
          <span className="product-price">₹{product.price}</span>
          <span className={`product-stock${isLowStock ? ' low' : ''}`}>
            {product.stock === 0 ? 'Out of stock' : isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </span>
        </div>

        {/* Actions */}
        <div className="product-actions">
          <button
            onClick={addToWishlist}
            disabled={wishlistStatus === 'loading' || wishlistStatus === 'success'}
            className={`wishlist-btn${wishlistStatus === 'success' ? ' added' : ''}`}
          >
            {wishlistLabel}
          </button>
          <button onClick={handleDetails} className="view-btn">
            View Details
          </button>
        </div>

        {errorMessage && <p className="error-msg">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
