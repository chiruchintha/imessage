import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
connectDB();
app.listen(3000, () => {
  console.log("you are listening to the port 3000");
});
