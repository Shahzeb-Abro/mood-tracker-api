import express from "express";
import { createMood, getTodaysMood } from "../controllers/mood.controller.js";
const router = express.Router();

router.post("/", createMood);
router.get("/today", getTodaysMood);

export default router;
