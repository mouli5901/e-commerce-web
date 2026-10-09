import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { ThemeContext } from "../theme/ThemeProvider";
import { useCart } from "../context/CartContext";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { totalCount, clearCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
    } catch (_) {}
    clearCart();
    if (setUser) setUser(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo with bold typographic voice */}
        <Link to="/" className="nav-logo" aria-label="ShopKart Homepage" onClick={closeMobile}>
          <span className="logo-text">SHOPKART</span>
          <span className="logo-dot" aria-hidden="true">.</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links desktop-only" aria-label="Primary Navigation">
          <Link to="/products" className="nav-item">Products</Link>

          {user ? (
            <>
              <Link to="/wishlist" className="nav-item">Wishlist</Link>
              <Link to="/cart" className="nav-item">Cart ({totalCount})</Link>
              <span className="nav-user" title={`Logged in as ${user.fullName}`}>
                👤 {user.fullName.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout"
                aria-label="Log out of account"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/cart" className="nav-item">Cart ({totalCount})</Link>
              <Link to="/login" className="nav-item">Sign In</Link>
              <Link to="/register" className="nav-item btn-primary-sm">Get Started</Link>
            </>
          )}
        </nav>

        {/* Action Controls: Theme toggle + Cart trigger + Mobile toggle */}
        <div className="nav-actions">
          {/* Theme Toggle Pill (min 44px touch area) */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="theme-toggle-indicator" aria-hidden="true" />
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Cart Trigger with live count badge */}
          <Link
            to="/cart"
            className="nav-cart-btn"
            aria-label={`Open shopping cart with ${totalCount} items`}
          >
            <span className="cart-icon-svg" aria-hidden="true">🛒</span>
            <span className="cart-label desktop-only">Cart</span>
            {totalCount > 0 && (
              <span className="nav-cart-badge">{totalCount}</span>
            )}
          </Link>

          {/* Mobile Hamburger Button (44px target) */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? "open-top" : ""}`} />
            <span className={`hamburger-bar ${mobileMenuOpen ? "open-mid" : ""}`} />
            <span className={`hamburger-bar ${mobileMenuOpen ? "open-bot" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-nav-content">
            <Link to="/products" className="mobile-nav-item" onClick={closeMobile}>
              Products
            </Link>
            <Link to="/cart" className="mobile-nav-item" onClick={closeMobile}>
              🛒 Cart ({totalCount})
            </Link>

            {user ? (
              <>
                <Link to="/wishlist" className="mobile-nav-item" onClick={closeMobile}>
                  🤍 Wishlist
                </Link>
                <div className="mobile-user-profile">
                  <span>Signed in as <strong>{user.fullName}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mobile-nav-item logout-link"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-item" onClick={closeMobile}>
                  Sign In
                </Link>
                <Link to="/register" className="mobile-nav-item mobile-cta-btn" onClick={closeMobile}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
