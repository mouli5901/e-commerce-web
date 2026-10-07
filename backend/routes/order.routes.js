const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, getMyOrders } = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;
