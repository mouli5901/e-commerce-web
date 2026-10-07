import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState('idle'); // idle | loading | success | error
  const [wishlistError, setWishlistError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        const data = res.data?.product ?? res.data;
        if (data?._id) {
          setProduct(data);
        } else {
          setError('Product not found.');
        }
      } catch {
        setError('Something went wrong while loading the product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToWishlist = async () => {
    if (!product || wishlistStatus === 'loading') return;
    setWishlistStatus('loading');
    setWishlistError('');
    try {
      const res = await API.post(`/wishlist/${product._id}`);
      if (res.data?.success) {
        setWishlistStatus('success');
      } else {
        setWishlistStatus('error');
        setWishlistError(res.data.message || 'Unable to add to wishlist.');
      }
    } catch (err) {
      setWishlistStatus('error');
      setWishlistError(err.response?.data?.message || 'Unable to add to wishlist.');
    }
  };

  if (loading) {
    return (
      <div className="state-container">
        <div className="loading-dots"><span /><span /><span /></div>
        <p className="state-text">Loading product…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <span className="state-icon">⚠️</span>
        <p className="state-title">Error</p>
        <p className="state-text">{error}</p>
        <button onClick={() => navigate(-1)} className="btn btn-ghost">
          ← Go Back
        </button>
      </div>
    );
  }

  if (!product) return null;

  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="product-details-page">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 'var(--sp-6)' }}
      >
        ← Back to Products
      </button>

      <div className="product-details-grid">
        {/* Image */}
        <div className="product-details-img">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Info */}
        <div className="product-details-info">
          <span className="product-details-badge">{product.category}</span>

          <h1 className="product-details-name">{product.name}</h1>

          <p className="product-details-price">₹{product.price}</p>

          {product.description && (
            <p className="product-details-desc">{product.description}</p>
          )}

          <div className="product-details-meta">
            <div className="product-details-meta-item">
              <span className="product-details-meta-label">Category</span>
              <span className="product-details-meta-value">{product.category}</span>
            </div>
            <div className="product-details-meta-item">
              <span className="product-details-meta-label">Stock</span>
              <span
                className="product-details-meta-value"
                style={{ color: product.stock === 0 ? 'var(--clr-error)' : isLowStock ? 'var(--clr-gold)' : 'var(--clr-success)' }}
              >
                {product.stock === 0
                  ? 'Out of stock'
                  : isLowStock
                  ? `Only ${product.stock} left`
                  : `${product.stock} available`}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="product-details-actions">
            <button className="btn btn-primary btn-lg" disabled={product.stock === 0}>
              🛒 Add to Cart
            </button>

            <button
              onClick={addToWishlist}
              disabled={wishlistStatus === 'loading' || wishlistStatus === 'success'}
              className="btn btn-ghost"
              style={{ borderRadius: 'var(--r-lg)' }}
            >
              {wishlistStatus === 'loading'
                ? '⏳ Saving…'
                : wishlistStatus === 'success'
                ? '♥ Saved to Wishlist'
                : '♡ Wishlist'}
            </button>
          </div>

          {wishlistError && <p className="error-msg">{wishlistError}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
