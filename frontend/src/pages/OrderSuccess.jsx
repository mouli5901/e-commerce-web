import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        if (res.data && res.data.success) {
          setOrder(res.data.order);
        } else {
          setError(res.data?.message || "Order not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to retrieve order details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="checkout-success-view">
        <div className="state-container">
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
          <p className="state-title">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="checkout-success-view">
        <div className="checkout-success-card">
          <span className="state-icon" role="img" aria-label="Error">⚠️</span>
          <h2>Unable to find order</h2>
          <p className="state-text">{error || "Order not found"}</p>
          <div className="success-actions">
            <Link to="/orders" className="btn-primary">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-success-view">
      <div className="checkout-success-card">
        <div className="success-icon-badge" aria-hidden="true">
          ✓
        </div>
        <span className="success-eyebrow">ORDER CONFIRMATION</span>
        <h1 className="success-title">Order Placed Successfully</h1>
        <p className="success-subtitle">
          Your order has been saved successfully.
        </p>

        {/* Order Meta Pills */}
        <div className="order-meta-summary-box">
          <div className="order-meta-item">
            <span className="order-meta-label">Order ID:</span>
            <strong className="order-meta-value">{order._id}</strong>
          </div>
          <div className="order-meta-item">
            <span className="order-meta-label">Total:</span>
            <strong className="order-meta-value">₹{order.totalAmount?.toLocaleString("en-IN")}</strong>
          </div>
          <div className="order-meta-item">
            <span className="order-meta-label">Status:</span>
            <span className={`status-badge-pill status-${order.status?.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Shipping & Payment Grid */}
        <div className="success-details-grid">
          <div className="success-detail-block">
            <h3>Shipping Details</h3>
            <p><strong>{order.shippingAddress?.fullName}</strong></p>
            <p>{order.shippingAddress?.addressLine1 || order.shippingAddress?.addressLine}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            <p>Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div className="success-detail-block">
            <h3>Payment & Summary</h3>
            <p>Payment Status: <strong className="text-success">{order.paymentStatus}</strong></p>
            {order.razorpayPaymentId && (
              <p className="text-muted-xs">Razorpay Ref: {order.razorpayPaymentId}</p>
            )}
            <p>Items Purchased: {order.items?.length || 0} product(s)</p>
            <p>Total Paid: <strong>₹{order.totalAmount?.toLocaleString("en-IN")}</strong></p>
          </div>
        </div>

        {/* Order Items List Snapshot */}
        <div className="success-items-list-card">
          <h3>Purchased Items (Price Snapshot)</h3>
          <div className="success-items-list">
            {order.items?.map((item, idx) => (
              <div key={idx} className="success-item-row">
                {item.image && (
                  <img src={item.image} alt={item.name} className="success-item-thumb" />
                )}
                <div className="success-item-info">
                  <span className="success-item-title">{item.name}</span>
                  <span className="success-item-qty">Qty: {item.quantity}</span>
                </div>
                <span className="success-item-price">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="success-actions-row">
          <Link to="/orders" className="btn-primary">
            View My Orders
          </Link>
          <Link to="/products" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
