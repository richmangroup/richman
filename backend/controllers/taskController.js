import Task from "../models/Task.js";
import Video from "../models/Video.js";
import Watched from "../models/Watched.js";
import User from "../models/user.js";

// ✅ BUY TASK PACKAGE
export const buyTaskPackage = async (req, res) => {
  try {
    const { packageType } = req.body;
    const user = await User.findById(req.user._id);

    // Package details
    const packages = {
      "10": { price: 10, reward: 1.5, videos: 10 },
      "20": { price: 20, reward: 1.6, videos: 20 },
    };

    const pack = packages[packageType];
    if (!pack) return res.status(400).json({ message: "Invalid package type" });

    // Balance check
    if (user.balance < pack.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    user.balance -= pack.price;
    await user.save();

    // Create new Task
    const task = new Task({
      user: user._id,
      packageType,
      totalVideos: pack.videos,
      rewardPerVideo: pack.reward,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await task.save();

    res.json({ message: "Task package purchased", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET USER TASKS (today's tasks)
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ COMPLETE VIDEO
export const completeVideo = async (req, res) => {
  try {
    const { taskId, videoId } = req.body;
    const user = await User.findById(req.user._id);
    const task = await Task.findById(taskId);

    if (!task || !task.isActive) return res.status(400).json({ message: "Invalid or expired task" });

    // Check if video already watched
    const alreadyWatched = await Watched.findOne({ user: user._id, task: taskId, video: videoId });
    if (alreadyWatched?.isCompleted) {
      return res.status(400).json({ message: "Video already completed" });
    }

    // Mark video as watched
    const watched = alreadyWatched || new Watched({ user: user._id, task: taskId, video: videoId });
    watched.isCompleted = true;
    watched.completedAt = new Date();
    await watched.save();

    // Add reward to user balance
    user.balance += task.rewardPerVideo;
    await user.save();

    res.json({ message: "Video completed & reward added", newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
