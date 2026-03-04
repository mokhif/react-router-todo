import dotenv from "dotenv";
dotenv.config();
import generateToken from "./src/utils/generateToken.js";
import express from "express";
import mongoose, { Schema } from "mongoose";
import cookieParser from "cookie-parser";
import User from "./src/models/user.js";
import jwt from "jsonwebtoken";
const app = express();
const port = 5000;
app.use(cookieParser());
app.use(express.json());
console.log(process.env.MONGODB_URI);
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});
//REgiostration Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    generateToken(res, user._id);
    res.status(200).json({ msg: "Registered successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("connected to mongodb");
}
main().catch((error) => console.log(error));
app.listen(port, () => console.log(`server is running on port:${port}`));
