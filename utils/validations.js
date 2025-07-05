import { z } from "zod";

export const moodSchema = z.object({
  mood: z.enum(["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"]),
  description: z
    .string()
    .min(1, "Description is required")
    .max(150, "Description must be less than 150 characters"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(3, "Maximum 3 tags are allowed"),
  sleepHours: z.enum([
    "0-2 hours",
    "3-4 hours",
    "5-6 hours",
    "7-8 hours",
    "9+ hours",
  ]),
  sleepValue: z.number().min(1).max(5).optional(),
});
