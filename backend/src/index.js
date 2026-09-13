import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";

const app = express();

connectDB();
app.listen(3000, () => {
  console.log("you are listening to the port 3000");
});
