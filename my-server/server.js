import dotenv from "dotenv";
dotenv.config();
import generateToken from "./src/utils/generateToken.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import User from "./src/models/user.js";
const app = express();
const port = 5000;
app.use(cookieParser());
app.use(express.json());
console.log(process.env.MONGODB_URI);
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
//REgistration Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });
    const user = await User.create({ name, email, password });
    generateToken(res, user._id);
    res.status(200).json({ msg: "Registered successfully" });
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
});

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("connected to mongodb");
}
main().catch((error) => console.log(error));
app.listen(port, () => console.log(`server is running on port:${port}`));
