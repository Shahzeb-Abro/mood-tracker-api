import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    mood: {
      type: String,
      required: true,
      enum: ["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"],
    },
    description: {
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

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;
