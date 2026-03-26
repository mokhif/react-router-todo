import express from "express";
import {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from "../controllers/todoController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getTodos);
