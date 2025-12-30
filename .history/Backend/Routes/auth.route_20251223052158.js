import express from "express";
import { 
  signup, 
  login, 
  logout, 
  refreshToken,  
  verifyToken 
} from "../Controller/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);


export default router;