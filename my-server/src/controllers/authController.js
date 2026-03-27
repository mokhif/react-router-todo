import User from "../models/user.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "user already exists" });
    const user = await User.create({ name, email, password });
    generateToken(res, user._id);
    res.status(200).json({ msg: "Registration Succesfuly" });
  } catch (error) {
    res.status(400).json({ msg: `error registering${error.message}` });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "user does not exists" });
    const passwordMatch = await User.comparePassword(password);
    if (!passwordMatch)
      return res.status(400).json({ msg: "password does not match" });
    generateToken(res, user._id);
    res.status(200).json({ msg: "login successfully" });
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
