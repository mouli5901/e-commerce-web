import React from 'react';
import { useNavigate } from 'react-router-dom';

const WishlistCard = ({ product, onRemove }) => {
  const navigate = useNavigate();
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="wishlist-card">
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
            {product.stock === 0
              ? 'Out of stock'
              : isLowStock
              ? `Only ${product.stock} left`
              : `${product.stock} in stock`}
          </span>
        </div>

        {/* Actions */}
        <div className="product-actions">
          <button
            className="view-btn"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            View Details
          </button>
          <button
            className="remove-btn"
            onClick={() => onRemove(product._id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
