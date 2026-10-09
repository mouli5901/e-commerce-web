import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../services/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, subtotal, total, clearCart, showToast } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "Karnataka",
    pincode: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateField = (name, value) => {
    let err = "";
    const trimmed = (value || "").trim();

    if (name === "fullName") {
      if (!trimmed) err = "Full name is required";
      else if (trimmed.length < 2) err = "Full name must be at least 2 characters";
    }
    if (name === "phone") {
      const cleanPhone = trimmed.replace(/\s+/g, "");
      if (!cleanPhone) err = "Phone number is required";
      else if (!/^\d{10}$/.test(cleanPhone)) err = "Phone must contain a valid 10-digit number";
    }
    if (name === "addressLine1") {
      if (!trimmed) err = "Address is required";
      else if (trimmed.length < 5) err = "Address must be at least 5 characters";
    }
    if (name === "city") {
      if (!trimmed) err = "City is required";
    }
    if (name === "state") {
      if (!trimmed) err = "State is required";
    }
    if (name === "pincode") {
      if (!trimmed) err = "Pincode is required";
      else if (!/^\d{6}$/.test(trimmed)) err = "Pincode must contain 6 digits";
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handlePaymentVerification = async (verifyPayload) => {
    try {
      const verifyRes = await API.post("/orders/verify-payment", verifyPayload);
      if (verifyRes.data && verifyRes.data.success) {
        // Clear global cart state in Context immediately
        clearCart();
        showToast("Payment verified! Order placed successfully.", "success");
        navigate(`/order-success/${verifyRes.data.order._id}`);
      } else {
        setApiError(verifyRes.data?.message || "Payment verification failed");
        showToast("Payment verification failed", "error");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Payment verification failed on the server.";
      setApiError(msg);
      showToast(msg, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate all fields
    const newErrors = {};
    const fields = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
    fields.forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) newErrors[f] = err;
    });

    setTouched({
      fullName: true,
      phone: true,
      addressLine1: true,
      city: true,
      state: true,
      pincode: true,
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setApiError("Please correct the form errors before placing your order.");
      return;
    }

    if (!cart || cart.length === 0) {
      setApiError("Your cart is empty. Please add items to your cart first.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create pending ShopKart order and Razorpay order on backend
      const res = await API.post("/orders/create-payment-order", {
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          addressLine1: form.addressLine1.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },
      });

      if (!res.data || !res.data.success) {
        setApiError(res.data?.message || "Failed to initiate payment order.");
        setSubmitting(false);
        return;
      }

      const orderData = res.data;

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && window.Razorpay) {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "ShopKart",
          description: "ShopKart Order Payment (Test Mode)",
          order_id: orderData.razorpayOrderId,
          handler: async function (response) {
            // Send returned payment details to backend for verification
            await handlePaymentVerification({
              shopKartOrderId: orderData.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setSubmitting(false);
          },
          prefill: {
            name: form.fullName,
            contact: form.phone,
          },
          theme: {
            color: "#6366f1",
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
              showToast("Payment cancelled. Your cart has been preserved.", "info");
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);

        razorpayInstance.on("payment.failed", function (response) {
          console.error("Razorpay Payment failed:", response.error);
          setApiError(response.error?.description || "Payment failed. Your cart has not been cleared.");
          showToast("Payment failed. Please try again.", "error");
          setSubmitting(false);
        });

        razorpayInstance.open();
      } else {
        // Fallback for offline/test environments when external CDN is unreachable
        const simulatedPaymentId = "pay_sim_" + Date.now();
        await handlePaymentVerification({
          shopKartOrderId: orderData.shopKartOrderId,
          razorpay_order_id: orderData.razorpayOrderId,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: "test_signature_mock_paid",
        });
        setSubmitting(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to process checkout.";
      setApiError(msg);
      showToast(msg, "error");
      setSubmitting(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-page-container">
        <div className="checkout-empty-view">
          <div className="checkout-empty-card">
            <span className="state-icon" role="img" aria-label="Cart">🛒</span>
            <h2>Your Cart is Empty</h2>
            <p className="state-text">Please add items to your cart before proceeding to checkout.</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <div className="checkout-header-bar">
        <Link to="/cart" className="checkout-back-link">
          ← Back to Cart
        </Link>
        <h1 className="checkout-main-title">Checkout</h1>
        <div className="checkout-trust-pill">
          🔒 Razorpay Test Mode
        </div>
      </div>

      {apiError && (
        <div className="checkout-error-banner" role="alert">
          ⚠️ {apiError}
        </div>
      )}

      <div className="checkout-grid-layout">
        {/* Shipping Details Form */}
        <form onSubmit={handleSubmit} className="checkout-form-column" noValidate>
          <div className="checkout-section-card">
            <h2 className="section-title">Shipping Details</h2>
            <p className="section-subtext">Enter the physical delivery address for your items.</p>

            <div className="checkout-form-grid">
              {/* Full Name */}
              <div className="form-field-group full-width">
                <label htmlFor="fullName">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="e.g. Aarav Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fullName && touched.fullName ? "input-err" : ""}
                  required
                />
                {errors.fullName && touched.fullName && (
                  <span className="field-err-msg">{errors.fullName}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-field-group">
                <label htmlFor="phone">
                  Phone Number <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.phone && touched.phone ? "input-err" : ""}
                  required
                />
                {errors.phone && touched.phone && (
                  <span className="field-err-msg">{errors.phone}</span>
                )}
              </div>

              {/* Pincode */}
              <div className="form-field-group">
                <label htmlFor="pincode">
                  Pincode <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  placeholder="6-digit PIN"
                  maxLength="6"
                  value={form.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.pincode && touched.pincode ? "input-err" : ""}
                  required
                />
                {errors.pincode && touched.pincode && (
                  <span className="field-err-msg">{errors.pincode}</span>
                )}
              </div>

              {/* Address Line 1 */}
              <div className="form-field-group full-width">
                <label htmlFor="addressLine1">
                  Address Line <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  placeholder="Street address, flat, floor"
                  value={form.addressLine1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.addressLine1 && touched.addressLine1 ? "input-err" : ""}
                  required
                />
                {errors.addressLine1 && touched.addressLine1 && (
                  <span className="field-err-msg">{errors.addressLine1}</span>
                )}
              </div>

              {/* City */}
              <div className="form-field-group">
                <label htmlFor="city">
                  City <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="e.g. Bengaluru"
                  value={form.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.city && touched.city ? "input-err" : ""}
                  required
                />
                {errors.city && touched.city && (
                  <span className="field-err-msg">{errors.city}</span>
                )}
              </div>

              {/* State */}
              <div className="form-field-group">
                <label htmlFor="state">
                  State <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="e.g. Karnataka"
                  value={form.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.state && touched.state ? "input-err" : ""}
                  required
                />
                {errors.state && touched.state && (
                  <span className="field-err-msg">{errors.state}</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary checkout-submit-btn"
            disabled={submitting}
          >
            {submitting ? "Processing Payment Order..." : `Place Order (Pay ₹${total.toLocaleString("en-IN")})`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="checkout-summary-column" aria-label="Order Summary">
          <div className="order-summary-card">
            <h2 className="summary-card-title">Order Summary</h2>

            <div className="summary-items-list">
              {cart.map((item) => (
                <div key={item.id || item._id} className="summary-item-row">
                  <img
                    src={item.image || item.product?.image}
                    alt={item.name}
                    className="summary-thumb"
                  />
                  <div className="summary-item-details">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-meta">
                      {item.name} × {item.quantity}
                    </span>
                  </div>
                  <span className="summary-item-price">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-calc-breakdown">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="calc-row">
                <span>Delivery</span>
                <span className="badge-free">FREE</span>
              </div>
              <div className="calc-row calc-total">
                <span>Total</span>
                <span className="grand-total-val">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="summary-guarantee-box">
              <p>🛡️ <strong>Razorpay Secured Payment</strong></p>
              <p className="text-muted-xs">
                Test Mode: Uses test card / UPI simulated gateway. No real money deducted.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
