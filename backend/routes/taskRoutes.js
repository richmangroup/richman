import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import TaskPlan from "../models/TaskPlan.js";

const router = express.Router();

/** ✅ CANCEL current plan */
router.post("/cancel-plan", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.hasTask || !user.activePlan) {
      return res.status(400).json({ message: "No active plan to cancel" });
    }

    // Reset user's plan and task data
    user.hasTask = false;
    user.activePlan = null;
    user.completedVideos = [];

    await user.save();

    res.json({ success: true, message: "✅ Your plan has been cancelled successfully" });
  } catch (err) {
    console.error("❌ Cancel plan error:", err);
    res.status(500).json({ message: "Server error while cancelling plan" });
  }
});

/** ✅ GET user task status + balance + active plan + completed videos */
router.get("/user-task-status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      hasTask: user.hasTask || false,
      balance: user.balance,
      activePlan: user.activePlan || null,
      completedVideos: user.completedVideos || []
    });
  } catch (err) {
    console.error("❌ Error fetching status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/** ✅ GET all available task plans */
router.get("/plans", async (req, res) => {
  try {
    const plans = await TaskPlan.find().lean();
    res.json(plans);
  } catch (err) {
    console.error("❌ Error fetching task plans:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/** ✅ PURCHASE task by planId */
router.post("/purchase-task", authMiddleware, async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ message: "Plan ID is required" });

    const plan = await TaskPlan.findById(planId);
    if (!plan) return res.status(400).json({ message: "Invalid task plan" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < plan.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance and assign plan
    user.balance -= plan.price;
    user.hasTask = true;
    user.activePlan = {
      planId: plan._id,
      name: plan.name,
      videoLimit: plan.videoLimit // important: set video limit per plan
    };
    user.completedVideos = []; // Reset completed videos on new plan purchase

    await user.save();

    res.json({
      success: true,
      message: `✅ ${plan.name} plan purchased successfully!`,
      newBalance: user.balance,
      hasTask: true,
      activePlan: user.activePlan
    });
  } catch (err) {
    console.error("❌ Purchase error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/** ✅ MARK video as completed & reward user */
router.post("/video-complete", authMiddleware, async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ message: "Video ID required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.hasTask || !user.activePlan) {
      return res.status(400).json({ message: "No active plan. Purchase a plan first." });
    }

    // Check if video already completed
    if (user.completedVideos.includes(videoId)) {
      return res.status(400).json({ message: "Video already completed." });
    }

    // Check if user has reached video limit of the plan
    if (user.completedVideos.length >= user.activePlan.videoLimit) {
      return res.status(400).json({ message: "Video limit reached for your plan." });
    }

    // Reward user
    const reward = 1.5;
    user.balance += reward;
    user.completedVideos.push(videoId);

    await user.save();

    res.json({
      success: true,
      message: `🎉 Video completed! You earned $${reward}`,
      newBalance: user.balance,
      completedVideos: user.completedVideos
    });
  } catch (err) {
    console.error("❌ Video complete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
