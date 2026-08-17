import express from "express";

import upload from "../config/multer.js";

import {
  getAdminMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/adminMenuController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route below requires:
// 1. User must be logged in
// 2. User must have admin role

router.use(protect);
router.use(adminOnly);


// GET all menu items
router.get("/menu", getAdminMenu);


// CREATE menu item with image
router.post(
  "/menu",
  upload.single("image"),
  createMenuItem
);


// UPDATE menu item
router.put(
  "/menu/:id",
  upload.single("image"),
  updateMenuItem
);


// DELETE menu item
router.delete(
  "/menu/:id",
  deleteMenuItem
);


export default router;