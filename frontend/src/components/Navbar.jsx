import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { ThemeContext } from "../theme/ThemeProvider";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    try { await API.post("/logout"); } catch (_) {}
    if (setUser) setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/home" className="nav-logo" aria-label="ShopKart home">
          ShopKart
        </Link>

        {/* Links */}
        <div className="nav-links">
          <Link to="/products" className="nav-item">Products</Link>

          {user ? (
            <>
              <Link to="/wishlist" className="nav-item">🤍 Wishlist</Link>
              <span className="nav-user">👤 {user.fullName.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Sign In</Link>
              <Link to="/register" className="nav-item btn-primary-sm">Get Started</Link>
            </>
          )}

          {/* Theme toggle pill */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
