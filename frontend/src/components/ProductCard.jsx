import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlistStatus, setWishlistStatus] = useState("idle"); // idle | loading | success | error
  const [addingToCart, setAddingToCart] = useState(false);

  const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
  const discountPercent =
    product.discount ||
    Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const ratingVal = product.rating || 4.8;
  const reviewCount = product.reviewsCount || 94;

  const handleDetails = () => navigate(`/products/${product._id}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAddingToCart(true);
    addToCart(product, 1);
    setTimeout(() => setAddingToCart(false), 500);
  };

  const addToWishlist = async (e) => {
    e.stopPropagation();
    if (wishlistStatus === "loading") return;
    setWishlistStatus("loading");
    try {
      const res = await API.post(`/wishlist/${product._id}`);
      if (res.data && res.data.success) {
        setWishlistStatus("success");
      } else {
        setWishlistStatus("error");
      }
    } catch (err) {
      setWishlistStatus("error");
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="product-card" onClick={handleDetails}>
      {/* Visual media container */}
      <div className="product-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-card-img"
        />
        <div className="product-card-badges">
          <span className="product-category-badge">{product.category}</span>
          {discountPercent > 0 && (
            <span className="product-discount-badge">{discountPercent}% OFF</span>
          )}
        </div>

        {/* Wishlist toggle pill */}
        <button
          type="button"
          onClick={addToWishlist}
          disabled={wishlistStatus === "loading" || wishlistStatus === "success"}
          className={`card-wishlist-btn ${wishlistStatus === "success" ? "active" : ""}`}
          aria-label={`Save ${product.name} to wishlist`}
          title={wishlistStatus === "success" ? "Saved to wishlist" : "Add to wishlist"}
        >
          {wishlistStatus === "success" ? "♥" : "♡"}
        </button>
      </div>

      {/* Product Content Body */}
      <div className="product-body">
        {/* Rating row */}
        <div className="product-rating-row" aria-label={`Rated ${ratingVal} out of 5 stars with ${reviewCount} reviews`}>
          <span className="star-icon" aria-hidden="true">★</span>
          <span className="rating-score">{ratingVal}</span>
          <span className="rating-count">({reviewCount})</span>
        </div>

        <h3 className="product-name">{product.name}</h3>

        <div className="product-pricing-row">
          <span className="product-price">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
          {originalPrice > product.price && (
            <span className="product-original-price">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="product-stock-indicator">
          {product.stock === 0 ? (
            <span className="stock-pill out-of-stock">● Out of stock</span>
          ) : isLowStock ? (
            <span className="stock-pill low-stock">● Only {product.stock} left</span>
          ) : (
            <span className="stock-pill in-stock">● In Stock</span>
          )}
        </div>

        {/* Action button row */}
        <div className="product-actions">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`btn-add-cart ${addingToCart ? "adding-bounce" : ""}`}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart +"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
