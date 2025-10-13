import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

//Register a new User 

export const registerUser = async( req, res ) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if(userExists)
            return res.status(400).json({  message: "User already exists" });

        const user = await User.create({
            name, 
            email, 
            password
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};