const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  logoutCustomer,
} = require("../controllers/customer.controller");
const { protect } = require("../middlewares/auth.middleware");

// Informative GET response when visited directly in a browser
router.get("/register", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Customer Registration API endpoint is active. To register, send a POST request containing fullName, email, password, and phone.",
  });
});

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/me", protect, getCustomerProfile);
router.post("/logout", protect, logoutCustomer);

module.exports = router;


