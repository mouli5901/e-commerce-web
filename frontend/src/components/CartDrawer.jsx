import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    total,
    freeShippingProgress,
    amountNeededForFreeShipping,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart} role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <h2 className="cart-drawer-title">YOUR CART</h2>
            <span className="cart-drawer-count-badge">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} ITEMS
            </span>
          </div>
          <button
            type="button"
            className="cart-drawer-close-btn"
            onClick={closeCart}
            aria-label="Close shopping cart"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="cart-shipping-meter">
          <div className="cart-shipping-text">
            {amountNeededForFreeShipping > 0 ? (
              <>
                Add <strong>₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</strong> more to get <strong>FREE SHIPPING</strong>
              </>
            ) : (
              <span className="cart-free-shipping-unlocked">
                🎉 Congratulations! You have unlocked <strong>FREE SHIPPING</strong>
              </span>
            )}
          </div>
          <div className="cart-progress-bar-bg" role="progressbar" aria-valuenow={freeShippingProgress} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="cart-progress-bar-fill"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-drawer-items">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <div className="cart-empty-icon" aria-hidden="true">🛍️</div>
              <h3 className="cart-empty-heading">Your bag is empty</h3>
              <p className="cart-empty-desc">
                Explore our catalog and find premium curated items built for you.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  closeCart();
                  navigate("/products");
                }}
              >
                BROWSE PRODUCTS
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.variant}`} className="cart-item-card">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  loading="lazy"
                />
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <Link
                      to={`/products/${item.id}`}
                      className="cart-item-name"
                      onClick={closeCart}
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.id, item.variant)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      🗑
                    </button>
                  </div>

                  {item.variant && item.variant !== "Standard" && (
                    <span className="cart-item-variant">Variant: {item.variant}</span>
                  )}

                  <div className="cart-item-bottom">
                    <div className="cart-qty-stepper" role="group" aria-label="Item quantity">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-pricing">
                      <span className="cart-item-price">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Early Subtotal & Action */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span className="cart-summary-val">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="cart-summary-row">
                <span>Estimated Shipping</span>
                <span className="cart-summary-val">
                  {shippingFee === 0 ? (
                    <span className="badge-free">FREE</span>
                  ) : (
                    `₹${shippingFee.toLocaleString("en-IN")}`
                  )}
                </span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span className="cart-total-val">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="cart-drawer-actions">
              <button
                type="button"
                className="btn-primary cart-checkout-btn"
                onClick={() => {
                  closeCart();
                  navigate("/cart");
                }}
              >
                VIEW CART PAGE ({cart.reduce((s, i) => s + i.quantity, 0)}) →
              </button>
              <button
                type="button"
                className="btn-outline cart-checkout-btn"
                onClick={handleCheckout}
              >
                PROCEED TO CHECKOUT
              </button>
              <button
                type="button"
                className="btn-outline cart-continue-btn"
                onClick={closeCart}
              >
                CONTINUE SHOPPING
              </button>
            </div>

            <div className="cart-drawer-trust-pills">
              <span>🔒 256-Bit Encrypted</span>
              <span>⚡ Fast Dispatch</span>
              <span>↺ 7-Day Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
