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
    userId: req.user._id,
  });

  if (todaysMood.length > 0) {
    return next(new AppError("You can only log one mood per day", 400));
  }

  const validationResult = moodSchema.safeParse(req.body);

  if (!validationResult.success) {
    return next(AppError.handleValidationError(validationResult.error));
  }

  const { mood, reflection, tags, sleepHours } = validationResult.data;

  const newMood = await Mood.create({
    mood,
    reflection,
    tags,
    sleepHours,
    userId: req.user._id,
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
    userId: req.user._id,
  });

  res.status(200).json({
    status: "success",
    data: todaysMood,
  });
});

export const getAverageMoodAndSleepValue = catchAsync(
  async (req, res, next) => {
    const today = new Date();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const moodToScore = {
      "Very Happy": 5,
      Happy: 4,
      Neutral: 3,
      Sad: 2,
      "Very Sad": 1,
    };

    const mood = await Mood.aggregate([
      {
        $match: {
          createdAt: { $lte: endOfDay },
          userId: req.user._id,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          sleepValue: 1,
          mood: 1,
        },
      },
    ]);

    if (mood.length < 5) {
      return next(new AppError("Not enough data yet", 404));
    }

    const last5Moods = mood.slice(0, 5);
    const previous5Moods = mood.length >= 10 ? mood.slice(5, 10) : [];

    const averageSleepValue = Math.round(
      last5Moods.reduce((acc, mood) => acc + mood.sleepValue, 0) / 5
    );

    const averageMoodValue = Math.round(
      last5Moods.reduce((acc, mood) => acc + moodToScore[mood.mood], 0) / 5
    );

    let sleepTrend = "Not enough data for trend";
    let moodTrend = "Not enough data for trend";
    if (previous5Moods.length > 0) {
      const previous5SleepAvg =
        previous5Moods.reduce((acc, mood) => acc + mood.sleepValue, 0) /
        previous5Moods.length;

      const previous5MoodAvg =
        previous5Moods.reduce((acc, mood) => acc + moodToScore[mood.mood], 0) /
        previous5Moods.length;

      if (previous5SleepAvg > averageSleepValue) {
        sleepTrend = "Decreasing";
      } else if (previous5SleepAvg < averageSleepValue) {
        sleepTrend = "Increasing";
      } else if (previous5SleepAvg === averageSleepValue) {
        sleepTrend = "Same";
      }

      if (previous5MoodAvg > averageMoodValue) {
        moodTrend = "Decreasing";
      } else if (previous5MoodAvg < averageMoodValue) {
        moodTrend = "Increasing";
      } else if (previous5MoodAvg === averageMoodValue) {
        moodTrend = "Same";
      }
    }

    const averageSleepValueToSleepHours = {
      1: "0-2 hours",
      2: "3-4 hours",
      3: "5-6 hours",
      4: "7-8 hours",
      5: "9+ hours",
    };

    const averageMoodValueToMood = {
      1: "Very Sad",
      2: "Sad",
      3: "Neutral",
      4: "Happy",
      5: "Very Happy",
    };

    res.status(200).json({
      status: "success",
      data: {
        averageSleepHours: averageSleepValueToSleepHours[averageSleepValue],
        averageMood: averageMoodValueToMood[averageMoodValue],
        sleepTrend,
        moodTrend,
      },
    });
  }
);

export const getMoodBetweenDates = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const moods = await Mood.find({
    createdAt: { $gte: startDateObj, $lte: endDateObj },
    userId: req.user._id,
  });

  res.status(200).json({
    status: "success",
    data: moods,
  });
});
