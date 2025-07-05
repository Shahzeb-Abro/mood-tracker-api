import express from "express";
import {
  createMood,
  getAverageMoodAndSleepValue,
  getTodaysMood,
} from "../controllers/mood.controller.js";
const router = express.Router();

router.post("/", createMood);
router.get("/today", getTodaysMood);
router.get("/average-mood-and-sleep-value", getAverageMoodAndSleepValue);

export default router;
