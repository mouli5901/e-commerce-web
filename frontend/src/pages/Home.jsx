import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

const Home = ({ user }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    { name: "All", icon: "✨" },
    { name: "Electronics", icon: "⚡" },
    { name: "Fashion", icon: "👔" },
    { name: "Footwear", icon: "👟" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = activeCategory !== "All" ? `?category=${activeCategory}` : "";
        const res = await API.get(`/products${query}`);
        setFeaturedProducts(res.data?.products || []);
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="home-storefront">
      {/* ── Bold Typographic Hero ── */}
      <section className="hero-section" aria-label="Featured Promotion">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            NEW DROP 2026 · EDITION ZERO
          </div>

          <h1 className="hero-headline">
            ENGINEERED <br />
            <span className="hero-accent-text">FOR EXCELLENCE.</span>
          </h1>

          <p className="hero-subheadline">
            Minimalist craftsmanship meets uncompromising performance. Curated electronics,
            footwear, and timeless wardrobe essentials designed for modern life.
          </p>

          <div className="hero-cta-group">
            <Link to="/products" className="btn-primary hero-btn-main">
              EXPLORE CATALOG →
            </Link>
            <button
              type="button"
              className="btn-outline hero-btn-sub"
              onClick={() => {
                const el = document.getElementById("featured-grid-anchor");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              FEATURED DROPS
            </button>
          </div>

          {user && (
            <div className="hero-welcome-chip">
              👋 Welcome back, <strong>{user.fullName.split(" ")[0]}</strong>
            </div>
          )}
        </div>

        {/* Hero Visual Accent Grid */}
        <div className="hero-visual-card">
          <div className="hero-stat-card">
            <span className="stat-big">100%</span>
            <span className="stat-label">ORIGINAL MERCHANDISE</span>
          </div>
          <div className="hero-stat-card">
            <span className="stat-big">₹0</span>
            <span className="stat-label">SHIPPING OVER ₹499</span>
          </div>
          <div className="hero-stat-card">
            <span className="stat-big">4.9★</span>
            <span className="stat-label">TOP RATED BUYER EXPERIENCE</span>
          </div>
        </div>
      </section>

      {/* ── Value Proposition / Trust Bar ── */}
      <section className="trust-strip-container" aria-label="Key Benefits">
        <div className="trust-strip-grid">
          <div className="trust-item">
            <span className="trust-strip-icon" aria-hidden="true">🚀</span>
            <div>
              <h4>Express Shipping</h4>
              <p>Dispatched in 24 hours across India</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-strip-icon" aria-hidden="true">🛡️</span>
            <div>
              <h4>Secure Payments</h4>
              <p>256-Bit SSL, UPI & Cash on Delivery</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-strip-icon" aria-hidden="true">↺</span>
            <div>
              <h4>7-Day Easy Return</h4>
              <p>Doorstep pickup with instant refunds</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-strip-icon" aria-hidden="true">⭐</span>
            <div>
              <h4>Verified Quality</h4>
              <p>Direct manufacturer warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products Grid ── */}
      <section className="featured-section" id="featured-grid-anchor" aria-label="Curated Collection">
        <div className="featured-section-header">
          <div>
            <span className="section-eyebrow">CURATED SELECTION</span>
            <h2 className="section-heading">FEATURED ESSENTIALS</h2>
          </div>

          {/* Category Chips Filter */}
          <div className="category-chips-reel" role="tablist" aria-label="Product categories">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.name}
                role="tab"
                aria-selected={activeCategory === cat.name}
                className={`category-chip ${activeCategory === cat.name ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                <span aria-hidden="true">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="state-container">
            <div className="loading-dots"><span /><span /><span /></div>
            <p className="state-text">Loading catalog…</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="state-container">
            <p className="state-title">No products in this category yet</p>
            <button onClick={() => setActiveCategory("All")} className="btn-primary">
              View All Products
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}

        <div className="featured-view-all-row">
          <Link to="/products" className="btn-primary btn-lg">
            BROWSE COMPLETE CATALOG ({featuredProducts.length}+) →
          </Link>
        </div>
      </section>

      {/* ── Minimalist Brand Statement ── */}
      <section className="brand-statement-section">
        <div className="statement-box">
          <span className="statement-quote-mark">“</span>
          <blockquote className="statement-quote">
            WE STRIP AWAY THE UNNECESSARY SO THE EXCEPTIONAL CAN SHINE.
          </blockquote>
          <p className="statement-author">SHOPKART DESIGN PHILOSOPHY</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="store-footer">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="nav-logo">
              <span className="logo-text">SHOPKART</span>
              <span className="logo-dot">.</span>
            </div>
            <p className="footer-desc">
              Premium modern goods curated with obsessive attention to detail and honest pricing.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <Link to="/">Store</Link>
            <Link to="/products">All Products</Link>
            <Link to="/wishlist">Saved Items</Link>
          </div>

          <div className="footer-links-col">
            <h4>Policies</h4>
            <span>7-Day Return Policy</span>
            <span>Free Shipping Above ₹499</span>
            <span>Terms of Service</span>
          </div>

          <div className="footer-links-col">
            <h4>Payment Methods</h4>
            <div className="footer-payment-tags">
              <span>UPI</span>
              <span>COD</span>
              <span>Cards</span>
              <span>NetBanking</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopKart Inc. All rights reserved. Crafted with precision.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
