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

 
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
  
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

export const protectRoute=