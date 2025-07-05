import express from "express";
import {
  createMood,
  getAverageMoodAndSleepValue,
  getMoodBetweenDates,
  getTodaysMood,
} from "../controllers/mood.controller.js";
const router = express.Router();

router.post("/", createMood);
router.get("/today", getTodaysMood);
router.get("/average-mood-and-sleep-value", getAverageMoodAndSleepValue);
router.get("/between-dates", getMoodBetweenDates);

export default router;
