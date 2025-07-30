import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import setupGameSocket from './crashGame/gameSocket.js';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import crashGameRoutes from './routes/crashGameRoutes/gameRoutes.js';
import videoRoutes from "./routes/videoRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";   // ✅ FIXED IMPORT
import SupportRequest from "./models/SupportRequest.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/crash-game", crashGameRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);

// ✅ Support request save route
app.post("/api/support-request", async (req, res) => {
  try {
    const { message } = req.body;
    const newRequest = new SupportRequest({ message });
    await newRequest.save();
    res.json({ status: "received", id: newRequest._id });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// ✅ Setup Socket.IO game logic
setupGameSocket(io);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));


  // Root check
app.get("/", (req, res) => {
  res.send("Backend is working! 🚀");
});