import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MONGO_URI);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected.`.cyan.underline);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
