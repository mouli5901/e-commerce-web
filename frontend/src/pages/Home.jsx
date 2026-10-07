import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Home = ({ user, setUser }) => {
  const [loading, setLoading] = useState(!user);
  const [customer, setCustomer] = useState(user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/me");
        setCustomer(response.data);
        if (setUser) setUser(response.data);
      } catch {
        if (setUser) setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, setUser]);

  if (loading) {
    return (
      <div className="state-container">
        <div className="loading-dots">
          <span /><span /><span />
        </div>
        <p className="state-text">Loading your profile…</p>
      </div>
    );
  }

  if (!customer) return null;

  const memberSince = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "—";

  return (
    <div className="home-container">
      {/* ── Hero Banner ── */}
      <div className="welcome-banner">
        <div className="welcome-banner-content">
          <h1>Hey, {customer.fullName.split(" ")[0]}! 👋</h1>
          <p>Welcome back to your ShopKart dashboard. Ready to discover something new?</p>

          {/* Quick stats */}
          <div className="home-stats">
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Orders</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Wishlist</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{memberSince}</div>
              <div className="stat-label">Member since</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile Card ── */}
      <div className="card profile-card">
        <h3>Account Details</h3>
        <hr className="divider" />

        <div className="profile-detail">
          <span className="label">Customer ID</span>
          <span className="value" style={{ fontFamily: "monospace", fontSize: "0.78rem", opacity: 0.7 }}>
            {customer._id}
          </span>
        </div>
        <div className="profile-detail">
          <span className="label">Full Name</span>
          <span className="value">{customer.fullName}</span>
        </div>
        <div className="profile-detail">
          <span className="label">Email</span>
          <span className="value">{customer.email}</span>
        </div>
        <div className="profile-detail">
          <span className="label">Phone</span>
          <span className="value">{customer.phone}</span>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "var(--sp-6)", display: "flex", gap: "var(--sp-3)" }}>
          <Link to="/products" className="btn btn-primary btn-sm">
            Browse Products →
          </Link>
          <Link to="/wishlist" className="btn btn-ghost btn-sm">
            🤍 My Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
