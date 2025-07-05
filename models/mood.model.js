import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    mood: {
      type: String,
      required: true,
      enum: ["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"],
    },
    reflection: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      enum: [
        "Joyful",
        "Down",
        "Anxious",
        "Calm",
        "Excited",
        "Frustrated",
        "Lonely",
        "Grateful",
        "Overwhelmed",
        "Motivated",
        "Irritable",
        "Peaceful",
        "Tired",
        "Hopeful",
        "Confident",
        "Stressed",
        "Content",
        "Disappointed",
        "Optimistic",
        "Restless",
      ],
    },
    sleepHours: {
      type: String,
      enum: ["0-2 hours", "3-4 hours", "5-6 hours", "7-8 hours", "9+ hours"],
      required: true,
    },
    sleepValue: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

moodSchema.pre("save", function (next) {
  const sleepHoursToSleepValue = {
    "0-2 hours": 1,
    "3-4 hours": 2,
    "5-6 hours": 3,
    "7-8 hours": 4,
    "9+ hours": 5,
  };

  this.sleepValue = sleepHoursToSleepValue[this.sleepHours];
  next();
});

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;
