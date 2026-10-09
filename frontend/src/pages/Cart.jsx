import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const {
    cart,
    loading,
    error,
    subtotal,
    totalCount,
    shippingFee,
    total,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();

  const navigate = useNavigate();

  // State: Loading
  if (loading) {
    return (
      <div className="cart-page-container">
        <div className="state-container">
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
          <p className="state-title">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // State: Error
  if (error) {
    return (
      <div className="cart-page-container">
        <div className="state-container">
          <span className="state-icon" role="img" aria-label="Warning">
            ⚠️
          </span>
          <h2 className="state-title">Unable to load your cart.</h2>
          <p className="state-text">{error}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={refreshCart}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // State: Empty
  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="state-container">
          <span className="state-icon" role="img" aria-label="Shopping Cart">
            🛒
          </span>
          <h2 className="state-title">Your cart is empty 🛒</h2>
          <p className="state-text">
            Looks like you haven't added anything yet.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <h1 className="cart-page-title">My Cart</h1>
        <span className="cart-page-count-badge">
          {totalCount} {totalCount === 1 ? "unit" : "units"}
        </span>
      </div>

      <div className="cart-page-layout">
        {/* Cart Items List */}
        <div className="cart-page-items-column">
          <div className="cart-page-items-list">
            {cart.map((item) => (
              <CartItem
                key={item.id || item._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="cart-page-summary-column" aria-label="Order summary">
          <div className="cart-order-summary-card">
            <h2 className="cart-summary-heading">Order Summary</h2>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Items:</span>
                <span className="cart-summary-val">{totalCount}</span>
              </div>

              <div className="cart-summary-row">
                <span className="cart-summary-label">Subtotal:</span>
                <span className="cart-summary-val">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="cart-summary-row">
                <span className="cart-summary-label">Shipping:</span>
                <span className="cart-summary-val">
                  {shippingFee === 0 ? (
                    <span className="badge-free">FREE</span>
                  ) : (
                    `₹${shippingFee.toLocaleString("en-IN")}`
                  )}
                </span>
              </div>

              <hr className="cart-summary-divider" />

              <div className="cart-summary-row cart-summary-total-row">
                <span className="cart-summary-total-label">Total:</span>
                <span className="cart-summary-total-val">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary cart-proceed-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <div className="cart-summary-links">
              <Link to="/products" className="cart-continue-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
