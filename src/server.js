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
   BODY PARSER
----------------------------- */
app.use(express.json());

/* -----------------------------
   CORS CONFIG (FIXED FOR RAILWAY + NETLIFY)
----------------------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://adarshanaik.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* IMPORTANT: allow preflight requests */
app.options("*", cors());

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
