import express from "express";
import { signupUser, loginUser, requestPasswordReset, resetPassword, googleAuth } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { addMenuItem } from "../controllers/menuController.js";
import upload from "../config/multer.js"; 

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/google-auth", googleAuth);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.post(
  "/add-menu", 
  protect,              
  adminOnly,            
  upload.single("image"),
  addMenuItem          
);

export default router;