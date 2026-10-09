import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("Standard");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [wishlistStatus, setWishlistStatus] = useState("idle");

  const variants = ["Standard", "Matte Black", "Silver Edition"];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        const data = res.data?.product ?? res.data;
        if (data?._id) {
          setProduct(data);
          setSelectedImage(data.image);
        } else {
          setError("Product not found.");
        }
      } catch {
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;
    const res = await addToCart(product._id);
    if (res?.success && quantity > 1) {
      await updateQuantity(product._id, quantity);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock === 0) return;
    const res = await addToCart(product._id);
    if (res?.success && quantity > 1) {
      await updateQuantity(product._id, quantity);
    }
    navigate("/cart");
  };

  const addToWishlist = async () => {
    if (!product || wishlistStatus === "loading") return;
    setWishlistStatus("loading");
    try {
      const res = await API.post(`/wishlist/${product._id}`);
      if (res.data?.success) {
        setWishlistStatus("success");
      } else {
        setWishlistStatus("error");
      }
    } catch {
      setWishlistStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="state-container">
        <div className="loading-dots"><span /><span /><span /></div>
        <p className="state-text">Loading product details…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="state-container">
        <span className="state-icon">⚠️</span>
        <h2 className="state-title">Product Unavailable</h2>
        <p className="state-text">{error || "Product not found"}</p>
        <button onClick={() => navigate("/products")} className="btn-primary">
          Return to Catalog
        </button>
      </div>
    );
  }

  const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const ratingScore = product.rating || 4.8;
  const reviewsCount = product.reviewsCount || 128;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Mock gallery items using primary image
  const galleryImages = [
    product.image,
    product.image,
    product.image,
  ];

  const mockReviews = [
    {
      id: 1,
      author: "Aditya R.",
      rating: 5,
      date: "3 days ago",
      title: "Phenomenal build quality",
      comment: "Exceeded my expectations. The finish is ultra premium and shipping was blazing fast in 2 days.",
      verified: true,
    },
    {
      id: 2,
      author: "Pooja M.",
      rating: 5,
      date: "1 week ago",
      title: "Worth every rupee",
      comment: "Clean packaging and exactly as described in the specifications. Will buy again from ShopKart.",
      verified: true,
    },
    {
      id: 3,
      author: "Siddharth K.",
      rating: 4,
      date: "2 weeks ago",
      title: "Great value for money",
      comment: "Very solid product for this price bracket. Customer support answered my queries immediately.",
      verified: true,
    },
  ];

  return (
    <div className="pdp-container">
      {/* Breadcrumb Trail */}
      <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="crumb-sep">/</span>
        <Link to="/products">Catalog</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-category">{product.category}</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="pdp-layout-grid">
        {/* Left: Gallery Column */}
        <div className="pdp-gallery-column">
          <div className="pdp-main-image-wrap">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="pdp-main-img"
            />
            {discountPercent > 0 && (
              <span className="pdp-discount-tag">{discountPercent}% OFF</span>
            )}
          </div>

          <div className="pdp-thumbnails-strip" role="group" aria-label="Product thumbnails">
            {galleryImages.map((img, idx) => (
              <button
                type="button"
                key={idx}
                className={`pdp-thumb-btn ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
                aria-label={`View product image ${idx + 1}`}
              >
                <img src={img} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info & Purchase Column */}
        <div className="pdp-info-column">
          <span className="pdp-category-pill">{product.category}</span>
          <h1 className="pdp-title">{product.name}</h1>

          {/* Rating Summary */}
          <div className="pdp-rating-summary">
            <div className="pdp-stars" aria-hidden="true">★★★★★</div>
            <span className="pdp-rating-number">{ratingScore}</span>
            <span className="pdp-review-count">· {reviewsCount} verified reviews</span>
          </div>

          {/* Pricing Row */}
          <div className="pdp-pricing-box">
            <span className="pdp-current-price">₹{product.price.toLocaleString("en-IN")}</span>
            {originalPrice > product.price && (
              <span className="pdp-original-price">₹{originalPrice.toLocaleString("en-IN")}</span>
            )}
            <span className="pdp-tax-inclusive">Inclusive of all taxes</span>
          </div>

          {/* Stock & Urgency Status */}
          <div className="pdp-stock-status">
            {product.stock === 0 ? (
              <span className="stock-badge out-of-stock">● Currently Out of Stock</span>
            ) : isLowStock ? (
              <span className="stock-badge low-stock">● Hurry! Only {product.stock} items left in stock</span>
            ) : (
              <span className="stock-badge in-stock">● In Stock — Dispatches within 24 hours</span>
            )}
          </div>

          <hr className="pdp-divider" />

          {/* Variant Selector */}
          <div className="pdp-variants-section">
            <span className="pdp-section-label">
              Edition / Color: <strong>{selectedVariant}</strong>
            </span>
            <div className="pdp-variant-chips" role="radiogroup" aria-label="Product variant options">
              {variants.map((v) => (
                <button
                  type="button"
                  key={v}
                  className={`pdp-variant-chip ${selectedVariant === v ? "active" : ""}`}
                  onClick={() => setSelectedVariant(v)}
                  role="radio"
                  aria-checked={selectedVariant === v}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="pdp-qty-section">
            <span className="pdp-section-label">Quantity:</span>
            <div className="cart-qty-stepper pdp-stepper" role="group" aria-label="Select quantity">
              <button
                type="button"
                className="cart-qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="cart-qty-val">{quantity}</span>
              <button
                type="button"
                className="cart-qty-btn"
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Desktop Primary Actions */}
          <div className="pdp-actions-row">
            <button
              type="button"
              className="btn-primary pdp-main-atc-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              ADD TO CART
            </button>
            <button
              type="button"
              className="btn-outline pdp-buy-now-btn"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              BUY NOW
            </button>
            <button
              type="button"
              className={`pdp-wishlist-toggle ${wishlistStatus === "success" ? "active" : ""}`}
              onClick={addToWishlist}
              disabled={wishlistStatus === "loading"}
              aria-label="Add to Wishlist"
              title="Add to Wishlist"
            >
              {wishlistStatus === "success" ? "♥ Saved" : "♡ Wishlist"}
            </button>
          </div>

          {/* Description */}
          <div className="pdp-description-block">
            <h3>Product Overview</h3>
            <p>{product.description}</p>
          </div>

          {/* Shipping & Returns Trust Cards */}
          <div className="pdp-trust-signals-grid">
            <div className="trust-card">
              <span className="trust-icon" aria-hidden="true">🚚</span>
              <div>
                <h4>Fast & Free Delivery</h4>
                <p>Free standard delivery on orders above ₹499 across India.</p>
              </div>
            </div>
            <div className="trust-card">
              <span className="trust-icon" aria-hidden="true">↺</span>
              <div>
                <h4>7-Day Easy Returns</h4>
                <p>Hassle-free doorstep pickup with instant refund guarantee.</p>
              </div>
            </div>
            <div className="trust-card">
              <span className="trust-icon" aria-hidden="true">🛡️</span>
              <div>
                <h4>Authentic & Certified</h4>
                <p>100% genuine brand merchandise backed by warranty.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pdp-reviews-section" aria-label="Customer Reviews">
        <div className="reviews-header">
          <div>
            <h2 className="reviews-title">CUSTOMER REVIEWS & EXPERIENCES</h2>
            <p className="reviews-subtext">Verified feedback from real ShopKart buyers.</p>
          </div>
          <div className="reviews-overall-score">
            <span className="score-big">{ratingScore}</span>
            <div>
              <div className="pdp-stars">★★★★★</div>
              <span className="score-total">Based on {reviewsCount} reviews</span>
            </div>
          </div>
        </div>

        <div className="reviews-cards-grid">
          {mockReviews.map((rev) => (
            <article key={rev.id} className="review-card">
              <div className="review-top">
                <span className="review-stars">{"★".repeat(rev.rating)}</span>
                <span className="review-date">{rev.date}</span>
              </div>
              <h4 className="review-headline">{rev.title}</h4>
              <p className="review-text">{rev.comment}</p>
              <div className="review-author-row">
                <span className="review-author">{rev.author}</span>
                {rev.verified && (
                  <span className="verified-badge">✓ Verified Buyer</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Mobile Sticky Add-to-Cart Bar */}
      <div className="pdp-sticky-mobile-bar" role="region" aria-label="Quick Add to Cart">
        <div className="sticky-mobile-price-group">
          <span className="sticky-mobile-label">Total Price:</span>
          <span className="sticky-mobile-price">
            ₹{(product.price * quantity).toLocaleString("en-IN")}
          </span>
        </div>
        <button
          type="button"
          className="btn-primary sticky-mobile-atc-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
