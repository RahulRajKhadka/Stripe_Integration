import User from "../Models/User.model.js";
import jwt from "jsonwebtoken"

const generateTokens=(userId)=>{

  const acessToken=jwt.sign({userId}, process.env.ACESS_TOKEN_SECRECT, {

    expiresIn:"15m"


  })

  const refreshToken=jwt.sign({userId}, process.env.RE_TOKEN_SECRECT, {

    expiresIn:"15m"


  })
}

export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password, name });

    const {acessToken, refreshToken}= generateTokens(user._id)

    return res.status(201).json({
      message: "User created successfully",
     cdw
    });
  } catch (error) {
    next(error);
  }
};


