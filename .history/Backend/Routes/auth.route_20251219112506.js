import express from "express";
import { 
  signup, 
  login, 
  logout, 
  refreshToken, 
  getProfile, 
  verifyToken 
} from "../Controller/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/profile", verifyToken, getProfile);

export default router;