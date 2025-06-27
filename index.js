import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import "colors";
dotenv.config();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Deployment successful 123");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
