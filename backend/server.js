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

// ✅ Allow only frontend URL in CORS
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. https://frontend-ibl1.onrender.com
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ✅ Allow preflight requests
app.options("*", cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// ✅ Express middlewares
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

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

// ✅ Root route check
app.get("/", (req, res) => {
  res.send("Backend is working! 🚀");
});

// ✅ MongoDB + Server Start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
