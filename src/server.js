// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

/* -----------------------------
   CORS CONFIG (IMPORTANT)
----------------------------- */
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:5173",
    credentials: true,
  })
);

/* -----------------------------
   MIDDLEWARES
----------------------------- */
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* -----------------------------
   ROUTES
----------------------------- */
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

/* -----------------------------
   DB + SERVER
----------------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running")
    );
  })
  .catch((err) => console.error(err));
