import User from "../Models/User.model.js";

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

    generateTokens(user)

    return res.status(201).json({
      message: "User created successfully",
     cdw
    });
  } catch (error) {
    next(error);
  }
};


