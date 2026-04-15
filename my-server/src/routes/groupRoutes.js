import express from "express";
import {
  createGroup,
  getGroup,
  deleteGroup,
  updateGroup,
} from "../controllers/groupController.js";
import protect from "../middleware/auth.js";
const router = express.Router();

router.get("/", protect, getGroup);
router.post("/", protect, createGroup);
router.delete("/:id", protect, deleteGroup);
router.put("/:id", protect, updateGroup);

export default router;
