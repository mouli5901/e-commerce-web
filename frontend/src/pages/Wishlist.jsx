import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import WishlistCard from "../components/WishlistCard";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/wishlist");
      if (res.data?.success) {
        setWishlist(res.data.wishlist);
      } else {
        setError(res.data.message || "Failed to load wishlist.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await API.delete(`/wishlist/${productId}`);
      if (res.data?.success) {
        fetchWishlist();
      } else {
        alert(res.data.message || "Failed to remove product.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error removing product.");
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  if (loading) {
    return (
      <div className="state-container">
        <div className="loading-dots"><span /><span /><span /></div>
        <p className="state-text">Loading your wishlist…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <span className="state-icon">⚠️</span>
        <p className="state-title">Something went wrong</p>
        <p className="state-text">{error}</p>
        <button onClick={fetchWishlist} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="state-container">
        <span className="state-icon">🤍</span>
        <p className="state-title">Your wishlist is empty</p>
        <p className="state-text">Save products you love and find them here.</p>
        <Link to="/products" className="btn btn-primary" style={{ padding: 'var(--sp-3) var(--sp-6)', borderRadius: 'var(--r-md)' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p className="wishlist-count">
          {wishlist.length} product{wishlist.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="products-grid">
        {wishlist.map((product) => (
          <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
