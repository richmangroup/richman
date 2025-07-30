import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  packageType: {
    type: String,
    enum: ["10", "20"], // 10 tasks or 20 tasks
    required: true,
  },
  totalVideos: {
    type: Number,
    required: true,
  },
  rewardPerVideo: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true, // Task active for today
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date, // Next day expire
    required: true,
  }
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
