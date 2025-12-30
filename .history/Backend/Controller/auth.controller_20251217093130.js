import User from "../Models/User.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET || "access_secret", {
    expiresIn: "15m"
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || "refresh_secret", {
    expiresIn: "7d"
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  try {
    // Upstash Redis syntax
    await redis.set(`refresh_token:${userId}`, refreshToken, {
      ex: 7 * 24 * 60 * 60 // 7 days in seconds
    });
  } catch (error) {
    console.error("Error storing refresh token in Redis:", error.message);
    // Continue even if Redis fails
  }
};

const setCookies = (res, accessToken, refreshToken) => {
  // Set cookies with httpOnly flag
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // Set to false for local development
    sameSite: "lax", // Use "lax" instead of "strict" for local development
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // Set to false for local development
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const signup = async (req, res) => {
  console.log("Signup request received:", req.body);
  
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // Create new user
    const user = await User.create({ email, password, name });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    
    // Store refresh token in Redis
    await storeRefreshToken(user._id.toString(), refreshToken);

    // Set cookies
    setCookies(res, accessToken, refreshToken);

    // Send response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tokens: {
        accessToken,  // For development/testing
        refreshToken  // For development/testing
      }
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};