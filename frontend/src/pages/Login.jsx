import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError("Please provide email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/login", credentials);
      if (response.data.success) {
        const profileRes = await API.get("/me");
        if (setUser) setUser(profileRes.data);
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Invalid email or password."
          : err.response?.data?.message || "Invalid credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand mark */}
        <div className="auth-brand-mark">🛒</div>

        <h2>Welcome<br />back.</h2>
        <p className="auth-subtitle">Sign in to your ShopKart account</p>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="john@example.com"
              value={credentials.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="auth-footer">
          No account yet? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
