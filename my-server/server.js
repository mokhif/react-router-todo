import dotenv from "dotenv";
dotenv.config();
import generateToken from "./src/utils/generateToken.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import User from "./src/models/user.js";
import protect from "./src/middleware/auth.js";
import Todo from "./src/models/todo.js";
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
    res.status(400).json({ msg: `error registering ${error.message}` });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch)
      return res.status(400).json({ msg: "Password does not match" });
    generateToken(res, user._id);
    res.status(200).json({ msg: "Login successful" });
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
});

app.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});

app.get("/home", protect, (req, res) => {
  res.status(200).json({ msg: "Welcome", user: req.user });
});
//removing cookie
app.post("/logout", (req, res) => {
  res.clearCookie("token").status(200).json({ msg: "Logged out successfully" });
});

//Todo Crud Section
//Creating a Todo
app.post("/todos", protect, async (req, res) => {
  try {
    const todo = await Todo.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
});
//requesting all todos
app.get("/todos", protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
});
//deleting a todo
app.delete("/todos/:id", protect, async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ msg: "Todo not found" });
    res.status(200).json(deletedTodo);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
});
//update a todo
app.put("/todos/:id", protect, async (req, res) => {
  try {
    const updateTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateTodo) return res.status(404).json({ msg: "Todo not found" });
    res.status(200).json(updateTodo);
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
