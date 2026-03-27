import dotenv from "dotenv";
dotenv.config();
import generateToken from "./src/utils/generateToken.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import User from "./src/models/user.js";
import protect from "./src/middleware/auth.js";
import { connectDB } from "./config/db.js";
import {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from "./src/controllers/todoController.js";
import { register, login } from "./src/controllers/authController.js";
import todoRouter from "./src/routes/todoRoutes.js";

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
app.post("/register", register);
//Login
app.post("/login", login);

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
app.use("/todos", todoRouter);
// starting the server and connectinmg to the database
connectDB().catch((error) => console.log(error));
app.listen(port, () => console.log(`server is running on port:${port}`));
