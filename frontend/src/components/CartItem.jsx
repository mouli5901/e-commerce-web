import React, { useState } from "react";
import { Link } from "react-router-dom";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [updating, setUpdating] = useState(false);
  const product = item.product || item || {};
  const productId = product._id || item.id || item._id;
  const name = product.name || item.name || "Product";
  const price = Number(product.price !== undefined ? product.price : item.price) || 0;
  const image = product.image || item.image || "";
  const stock = Number(product.stock !== undefined ? product.stock : item.stock) || 10;
  const quantity = Number(item.quantity) || 1;
  const itemTotal = price * quantity;

  const handleDecrease = async () => {
    if (quantity <= 1 || updating) return;
    setUpdating(true);
    await onUpdateQuantity(productId, quantity - 1);
    setUpdating(false);
  };

  const handleIncrease = async () => {
    if (quantity >= stock || updating) return;
    setUpdating(true);
    await onUpdateQuantity(productId, quantity + 1);
    setUpdating(false);
  };

  const handleRemove = async () => {
    if (updating) return;
    setUpdating(true);
    await onRemove(productId);
    setUpdating(false);
  };

  const isAtMaxStock = quantity >= stock;

  return (
    <article className="cart-page-item" aria-label={`Cart item: ${name}`}>
      {/* Product Image */}
      <div className="cart-page-item-img-wrap">
        <Link to={`/products/${productId}`}>
          <img
            src={image}
            alt={name}
            className="cart-page-item-img"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Info & Controls */}
      <div className="cart-page-item-content">
        <div className="cart-page-item-header">
          <div className="cart-page-item-title-wrap">
            <Link to={`/products/${productId}`} className="cart-page-item-name">
              {name}
            </Link>
            <span className="cart-page-item-unit-price">
              ₹{price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="cart-page-item-total-price">
            ₹{itemTotal.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Stepper & Remove Action */}
        <div className="cart-page-item-actions">
          <div className="cart-qty-control-group">
            <div className="cart-qty-stepper" role="group" aria-label="Item quantity controls">
              <button
                type="button"
                className="cart-qty-btn cart-qty-minus"
                onClick={handleDecrease}
                disabled={quantity <= 1 || updating}
                aria-label={`Decrease quantity of ${name}`}
                title={quantity <= 1 ? "Minimum quantity is 1 (use Remove to delete item)" : "Decrease quantity"}
              >
                −
              </button>
              <span className="cart-qty-val" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="cart-qty-btn cart-qty-plus"
                onClick={handleIncrease}
                disabled={isAtMaxStock || updating}
                aria-label={`Increase quantity of ${name}`}
                title={isAtMaxStock ? "Max stock limit reached" : "Increase quantity"}
              >
                +
              </button>
            </div>

            {isAtMaxStock && (
              <span className="cart-stock-warning">Max available stock</span>
            )}
          </div>

          <button
            type="button"
            className="cart-item-remove-text-btn"
            onClick={handleRemove}
            disabled={updating}
            aria-label={`Remove ${name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
