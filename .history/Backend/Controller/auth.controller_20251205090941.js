export const signup =async (req, res) => {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }














    
  res.send("Signup Route");
}

export const login = async (req, res) => {
  res.send("Login Route");
}

export const logout = async (req, res) => {
  res.send("Logout Route");
}

