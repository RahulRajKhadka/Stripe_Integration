// middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access token required" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Attach user ID to request
    req.userId = decoded.userId;
    req.user = { id: decoded.userId };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Access token expired",
        code: "TOKEN_EXPIRED" 
      });
    }
    
    return res.status(403).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};


export const isAdmin = async (req, res, next) => {
  try {
    const User = (await import("../models/user.model.js")).default;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }
    
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};