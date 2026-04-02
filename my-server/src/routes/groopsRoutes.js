import express from "express";
import {
  createGroop,
  getGroops,
  deleteGroop,
  updateGroop,
} from "../controllers/groopsController.js";
import protect from "../middleware/auth.js";
const router = express.Router();

router.get("/", protect, getGroops);
router.post("/", protect, createGroop);
router.delete("/:id", protect, deleteGroop);
router.put("/:id", protect, updateGroop);

export default router;
