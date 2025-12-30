import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

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

  await redis.set(`refresh_token:${userId}`, refreshToken, {
    ex: 7 * 24 * 60 * 60 // 7 days in seconds
  });
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


export const signup = async (req, res, next) => {
  try {
    console.log("Signup request received:", req.body); // Debug log
    console.log("Headers:", req.headers); // Debug log
    
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: "All fields are required",
        received: req.body 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password, name });

    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Add error handling for Redis
    try {
      await storeRefreshToken(user._id, refreshToken);
    } catch (redisError) {
      console.error("Redis error:", redisError);
      // Continue anyway - don't fail signup if Redis fails
    }

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