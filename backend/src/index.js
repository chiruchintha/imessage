import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const publicDir = path.join(process.cwd(), "public");

app.use(
  "/api/webhook/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook,
);

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
connectDB();
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}
app.listen(3000, () => {
  console.log("you are listening to the port 3000");
});
