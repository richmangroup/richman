import express from "express";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";
import { addVideo, deleteVideo, updateVideo, getAllVideos } from "../controllers/videoController.js";
import User from "../models/user.js";
import Video from "../models/Video.js";

const router = express.Router();

/**
 * ✅ Get ALL videos (Admin use)
 */
router.get("/", authMiddleware, getAllVideos);

/**
 * ✅ Get only videos allowed for current user's plan
 */
router.get("/user-videos", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("activePlan");

    if (!user.activePlan) {
      return res.status(403).json({ message: "No active plan found" });
    }

    const limit = user.activePlan.videoLimit || 0;
    const videos = await Video.find().limit(limit);

    res.json(videos);
  } catch (err) {
    console.error("❌ Error fetching user videos:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Mark video complete & reward user
 */
router.post("/complete", authMiddleware, async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user._id).populate("activePlan");
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check if user has plan
    if (!user.activePlan) {
      return res.status(403).json({ message: "You need to purchase a plan first" });
    }

    // ✅ Check if video already completed
    const alreadyCompleted = user.completedVideos.some(v => v.videoId.toString() === videoId);
    if (alreadyCompleted) {
      return res.status(400).json({ message: "Video already completed" });
    }

    // ✅ Check plan video limit
    if (user.completedVideos.length >= user.activePlan.videoLimit) {
      return res.status(403).json({ message: "Your plan video limit has been reached" });
    }

    // ✅ Add video to completed list & give reward
    user.completedVideos.push({ videoId });
    user.balance += 1.5;

    // ✅ If user completed all videos in plan → deactivate plan
    if (user.completedVideos.length >= user.activePlan.videoLimit) {
      user.activePlan = null;
    }

    await user.save();

    res.json({
      success: true,
      message: "Reward added successfully",
      newBalance: user.balance,
      completedVideos: user.completedVideos.map(v => v.videoId)
    });
  } catch (err) {
    console.error("❌ Error completing video:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Admin video management
 */
router.post("/", authMiddleware, adminOnly, addVideo);
router.put("/:id", authMiddleware, adminOnly, updateVideo);
router.delete("/:id", authMiddleware, adminOnly, deleteVideo);

export default router;
