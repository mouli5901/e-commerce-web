import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", phone: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, phone } = formData;
    if (!fullName || !email || !password || !phone) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const response = await API.post("/register", formData);
      if (response.data.success) {
        setSuccessMsg("Account created! Redirecting…");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand mark */}
        <div className="auth-brand-mark">✨</div>

        <h2>Create your<br />account.</h2>
        <p className="auth-subtitle">Join ShopKart — it's completely free</p>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success">
            <span>✓</span> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-fullName">Full Name</label>
            <input
              type="text"
              id="reg-fullName"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              type="email"
              id="reg-email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              type="password"
              id="reg-password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone">Phone Number</label>
            <input
              type="tel"
              id="reg-phone"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
