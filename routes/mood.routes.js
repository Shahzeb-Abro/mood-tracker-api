import express from "express";
import {
  createMood,
  getAverageMoodAndSleepValue,
  getMoodBetweenDates,
  getTodaysMood,
} from "../controllers/mood.controller.js";
import { authorize } from "../middlewares/authorize.js";
const router = express.Router();

router.post("/", authorize, createMood);
router.get("/today", authorize, getTodaysMood);
router.get(
  "/average-mood-and-sleep-value",
  authorize,
  getAverageMoodAndSleepValue
);
router.get("/between-dates", authorize, getMoodBetweenDates);

export default router;
