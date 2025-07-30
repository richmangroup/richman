import mongoose from "mongoose";

// 📥 Embedded deposit schema
const depositSchema = new mongoose.Schema({
  coin: { type: String, required: true },
  amount: { type: Number, required: true },
  txId: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

// ✅ User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    totalDeposited: { type: Number, default: 0 },
    username: { type: String, default: "", trim: true },
    profilePic: { type: String, default: "" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    pendingDeposits: [depositSchema],
    isAdmin: { type: Boolean, default: false },

    // ✅ Task System
    hasTask: { type: Boolean, default: false },
    activePlan: {
      planId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskPlan" },
      name: String,
      videoLimit: Number,
    },

    // ✅ Completed Videos - videoId as String for easy handling on frontend
    completedVideos: [
      {
        videoId: { type: String, required: true }, // changed to string instead of ObjectId for simplicity
        completedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
