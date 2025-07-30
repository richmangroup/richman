import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,  // YouTube link or uploaded video path
  },
  duration: {
    type: Number, // seconds
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Video || mongoose.model("Video", videoSchema);
