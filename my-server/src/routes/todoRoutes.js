import express from "express";
import {
  createTodo,
  getTodos,
  getGroupTodo,
  deleteTodo,
  updateTodo,
} from "../controllers/todoController.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.get("/:groupId", protect, getGroupTodo);
router.get("/", protect, getTodos);
router.post("/", protect, createTodo);
router.delete("/:id", protect, deleteTodo);
router.put("/:id", protect, updateTodo);

export default router;
