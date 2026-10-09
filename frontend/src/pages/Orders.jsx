import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressingId, setProgressingId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/orders");
      if (res.data && res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError("Unable to load orders.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Bonus progression handler: PLACED -> CONFIRMED -> SHIPPED -> DELIVERED
  const handleProgressStatus = async (orderId, currentStatus) => {
    const progression = {
      PLACED: "CONFIRMED",
      CONFIRMED: "SHIPPED",
      SHIPPED: "DELIVERED",
    };

    const nextStatus = progression[currentStatus];
    if (!nextStatus || progressingId) return;

    setProgressingId(orderId);
    try {
      const res = await API.patch(`/orders/${orderId}/status`, { status: nextStatus });
      if (res.data && res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o))
        );
      }
    } catch (err) {
      console.error("Status progression error:", err);
    } finally {
      setProgressingId(null);
    }
  };

  // State: Loading
  if (loading) {
    return (
      <div className="orders-page-container">
        <div className="state-container">
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
          <p className="state-title">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // State: Error
  if (error) {
    return (
      <div className="orders-page-container">
        <div className="state-container">
          <span className="state-icon" role="img" aria-label="Error">⚠️</span>
          <h2 className="state-title">Unable to load your orders.</h2>
          <p className="state-text">{error}</p>
          <button type="button" className="btn-primary" onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // State: Empty
  if (!orders || orders.length === 0) {
    return (
      <div className="orders-page-container">
        <div className="state-container">
          <span className="state-icon" role="img" aria-label="Box">📦</span>
          <h2 className="state-title">You have not placed any orders yet.</h2>
          <p className="state-text">Your purchase history and order receipts will appear here.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page-container">
      <div className="orders-page-header">
        <h1 className="orders-page-title">My Orders</h1>
        <span className="orders-count-badge">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="orders-cards-grid">
        {orders.map((order) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <article key={order._id} className="order-history-card">
              {/* Card Header */}
              <div className="order-card-header">
                <div>
                  <h3 className="order-card-id">Order #{order._id}</h3>
                  <span className="order-card-date">{dateStr}</span>
                </div>
                <div className="order-card-status-wrap">
                  <span className={`status-badge-pill status-${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                  {order.paymentStatus === "PAID" && (
                    <span className="payment-paid-tag">PAID</span>
                  )}
                </div>
              </div>

              {/* Items Snapshot */}
              <div className="order-card-items-list">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-card-item-row">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="order-item-thumb" />
                    )}
                    <span className="order-item-title">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="order-item-cost">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Card Footer: Total + Actions */}
              <div className="order-card-footer">
                <div className="order-card-total-group">
                  <span className="order-total-label">Total:</span>
                  <span className="order-total-amount">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="order-card-actions-group">
                  {/* Bonus: Status Progression Button */}
                  {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                    <button
                      type="button"
                      className="btn-status-progress"
                      onClick={() => handleProgressStatus(order._id, order.status)}
                      disabled={progressingId === order._id}
                      title="Bonus: Advance order status progression"
                    >
                      {progressingId === order._id
                        ? "Updating..."
                        : order.status === "PLACED"
                        ? "Mark Confirmed →"
                        : order.status === "CONFIRMED"
                        ? "Mark Shipped →"
                        : "Mark Delivered →"}
                    </button>
                  )}

                  <Link to={`/order-success/${order._id}`} className="btn-outline btn-view-order">
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
