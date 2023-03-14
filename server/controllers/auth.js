import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* Register User */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    /* Create a salt */
    const salt = await bcrypt.genSalt();
    /* Mix the created salt to password */
    const passwordHash = await bcrypt.hash(password, salt);
    /* Create a new user */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });
    /* save the user */
    const savedUser = await newUser.save();
    /* Send to the frontend */
    res.status(201).json(savedUser);
  } catch (e) {
    /* send error if it's occured */
    res.status(500).json({ error: e.message });
  }
};

/* Loggin in */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    /* find user if exist in db */
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    }
    /* Compare the hashed password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }
    /* create a token for user */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    /* delete password for preventing to go to the frontend */
    delete user.password;
    res.status(200).json({ token, user });
  } catch (e) {
    /* send error if it's occured */
    res.status(500).json({ error: e.message });
  }
};
