import Mood from "../models/mood.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { moodSchema } from "../utils/validations.js";

export const createMood = catchAsync(async (req, res, next) => {
  // Check if there is already mood logged for today
  const today = new Date();

  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todaysMood = await Mood.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  if (todaysMood.length > 0) {
    return next(new AppError("You can only log one mood per day", 400));
  }

  const validationResult = moodSchema.safeParse(req.body);

  if (!validationResult.success) {
    return next(AppError.handleValidationError(validationResult.error));
  }

  const { mood, description, tags, sleepHours } = validationResult.data;

  const newMood = await Mood.create({
    mood,
    description,
    tags,
    sleepHours,
  });
  res.status(201).json({
    status: "success",
    data: newMood,
  });
});

export const getTodaysMood = catchAsync(async (req, res, next) => {
  const today = new Date();

  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todaysMood = await Mood.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  res.status(200).json({
    status: "success",
    data: todaysMood,
  });
});
