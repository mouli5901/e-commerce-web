const Order = require("../models/order.model");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.model");

// Optional customer extraction helper
const extractCustomerFromReq = async (req) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return null;
    const secret = process.env.JWT_SECRET || "default_jwt_secret_key_shopkart";
    const decoded = jwt.verify(token, secret);
    return await Customer.findById(decoded.id).select("-password");
  } catch (err) {
    return null;
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingFee, total, guestEmail } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: "Cart cannot be empty" });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: "Shipping address fields are required" });
    }

    const customer = await extractCustomerFromReq(req);
    const orderNumber = "SK-" + Math.floor(100000 + Math.random() * 900000);

    const order = await Order.create({
      orderNumber,
      customer: customer ? customer._id : null,
      guestEmail: guestEmail || (customer ? customer.email : ""),
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "COMPLETED",
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee) || 0,
      total: Number(total),
      status: "CONFIRMED",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order;
    if (id.startsWith("SK-")) {
      order = await Order.findOne({ orderNumber: id });
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const customer = await extractCustomerFromReq(req);
    if (!customer) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const orders = await Order.find({ customer: customer._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
};
