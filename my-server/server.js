import dotenv from "dotenv";
import express from "express";
import mongoose, { Schema } from "mongoose";
import cookieParser from "cookie-parser";
import User from "./models/users.js";
dotenv.config();
import jwt from "jsonwebtoken";
app.use(cookieParser());
app.use(express.json());
const app = express();
const port = 5000;
console.log(process.env.MONGODB_URI);
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});
//REgiostration Route
Router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.crate({ name, email, password });
  generateToken(res, user._id);
  res.status(200).json({ msg: "Registered successfully" });
});

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("connected to mongodb");
}
main().catch((error) => console.log(error));
app.listen(port, () => console.log(`server is running on port:${port}`));
