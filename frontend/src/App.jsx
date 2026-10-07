import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import ThemeProvider from "./theme/ThemeProvider";
import { CartProvider } from "./context/CartContext";
import API from "./services/api";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if customer already logged in via cookie
    const checkAuth = async () => {
      try {
        const res = await API.get("/me");
        if (res.data?._id) {
          setUser(res.data);
        }
      } catch {
        // Not logged in or guest
      }
    };
    checkAuth();
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          {/* Accessibility: Skip to Content */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <Navbar user={user} setUser={setUser} />

          <main id="main-content" tabIndex="-1">
            <Routes>
              <Route path="/" element={<Home user={user} setUser={setUser} />} />
              <Route path="/home" element={<Home user={user} setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Sliding Cart Drawer */}
          <CartDrawer />

          {/* Global Notification Feedback */}
          <Toast />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
