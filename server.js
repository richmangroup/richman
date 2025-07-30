import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import SupportRequest from "./models/SupportRequest.js";
import authRoutes from "./routes/authRoutes.js";



// ✅ For socket.io
import http from "http";
import { Server } from "socket.io";
import setupGameSocket from "./crashGame/gameSocket.js"; // 🔥 Crash game logic

dotenv.config();

const app = express();
const server = http.createServer(app); // For socket.io to work
const io = new Server(server, {
  cors: { origin: "*" },
});



// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);



// ✅ Save Support Requests
app.post("/api/support-request", async (req, res) => {
  try {
    const { message } = req.body;

    const newRequest = new SupportRequest({ message });
    await newRequest.save();

    console.log("🚨 Support request saved:", newRequest);
    res.json({ status: "received", id: newRequest._id });
  } catch (error) {
    console.error("Error saving support request:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// ✅ Start crash game socket engine
setupGameSocket(io); // 🎮 Attach socket.io game logic

// ✅ MongoDB + Server Startup
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));

  