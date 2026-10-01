import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      } catch (err) {
        // If 401 or missing token -> Redirect to login
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
      <div className="home-container">
        <div className="card">
          <p>Loading customer profile...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="home-container">
      <div className="welcome-banner">
        <h1>Welcome to ShopKart, {customer.fullName}! 👋</h1>
        <p>You have successfully logged in to your account dashboard.</p>
      </div>

      <div className="card profile-card">
        <h3>Customer Profile Details</h3>
        <hr className="divider" />
        
        <div className="profile-detail">
          <span className="label">Customer ID:</span>
          <span className="value">{customer._id}</span>
        </div>

        <div className="profile-detail">
          <span className="label">Full Name:</span>
          <span className="value">{customer.fullName}</span>
        </div>

        <div className="profile-detail">
          <span className="label">Email Address:</span>
          <span className="value">{customer.email}</span>
        </div>

        <div className="profile-detail">
          <span className="label">Phone Number:</span>
          <span className="value">{customer.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
