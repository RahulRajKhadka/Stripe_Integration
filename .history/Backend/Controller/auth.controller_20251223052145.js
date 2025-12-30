import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

// Token generation functions (already exist)
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  // For Upstash Redis
  await redis.set(`refresh_token:${userId}`, refreshToken, {
    ex: 7 * 24 * 60 * 60 // 7 days in seconds
  });
};

// Remove refresh token (for logout)
const removeRefreshToken = async (userId) => {
  await redis.del(`refresh_token:${userId}`);
};

// Get refresh token (for token refresh)
const getRefreshToken = async (userId) => {
  return await redis.get(`refresh_token:${userId}`);
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Clear cookies (for logout)
const clearCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

// SIGNUP CONTROLLER (already exists)
export const signup = async (req, res, next) => {
  try {
    const { email, password, name, role  } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let userRole =role || "user";
   
    const user = await User.create({ email, password, name,role:userRole  });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: "User created successfully"
    });
  } catch (error) {
    console.error("Signup error:", error);
    next(error);
  }
};

// LOGIN CONTROLLER
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Store refresh token in Redis
    await storeRefreshToken(user._id, refreshToken);

    // Set cookies
    setCookies(res, accessToken, refreshToken);

    // Return user info (without password)
    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: "Login successful"
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// LOGOUT CONTROLLER
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      try {
        // Decode the refresh token to get userId
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Remove refresh token from Redis
        await removeRefreshToken(decoded.userId);
      } catch (error) {
        console.log("Token verification failed on logout:", error.message);
      }
    }

    // Clear cookies
    clearCookies(res);

    return res.status(200).json({ 
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    next(error);
  }
};

// REFRESH TOKEN CONTROLLER
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ 
        message: "Refresh token not found" 
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(403).json({ 
        message: "Invalid or expired refresh token" 
      });
    }

    // Check if refresh token exists in Redis
    const storedToken = await getRefreshToken(decoded.userId);
    
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ 
        message: "Refresh token not found or invalid" 
      });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);
    
    // Update refresh token in Redis
    await storeRefreshToken(decoded.userId, newRefreshToken);

    // Set new cookies
    setCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({ 
      message: "Token refreshed successfully" 
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    next(error);
  }
};



// VERIFY TOKEN MIDDLEWARE (for protecting routes)
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "Access token required" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Attach user ID to request
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Access token expired",
        code: "TOKEN_EXPIRED" 
      });
    }
    
    return res.status(403).json({ 
      message: "Invalid token" 
    });
  }
};