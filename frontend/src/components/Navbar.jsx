import React from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      if (setUser) setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">
          ShopKart
        </Link>
        <div className="nav-links">
          <Link to="/products" className="nav-item">
            Products
          </Link>
          {user ? (
            <>
              <span className="nav-user">Hello, {user.fullName}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                Login
              </Link>
              <Link to="/register" className="nav-item btn-primary-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
