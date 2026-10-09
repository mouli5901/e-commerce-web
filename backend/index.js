const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

// Ensure Node.js uses standard DNS resolution for MongoDB Atlas SRV records
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if custom DNS servers are locked by environment
}

const customerRoutes = require("./routes/customer.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shopkart Backend API is running successfully!",
    endpoints: {
      register: "POST /customers/register",
      login: "POST /customers/login",
      profile: "GET /customers/me",
      logout: "POST /customers/logout",
    },
  });
});

app.use("/customers", customerRoutes);
app.use("/", customerRoutes);
const productRoutes = require("./routes/product.routes");
app.use("/products", productRoutes);
const wishlistRoutes = require("./routes/wishlist.routes");
app.use("/wishlist", wishlistRoutes);
const cartRoutes = require("./routes/cart.routes");
app.use("/cart", cartRoutes);
const orderRoutes = require("./routes/order.routes");
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopkart";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });

module.exports = app;

