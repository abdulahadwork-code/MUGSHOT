import express from "express";

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  protect,
  adminOnly,
  employeeOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/all", protect, employeeOnly, getAllOrders);

router.patch("/:id/status", protect, employeeOnly, updateOrderStatus);


export default router;