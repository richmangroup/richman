import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import {
  registerUser,
  loginUser,
  depositFunds,
  withdrawFunds,
  getMe,
  updateUsername,
  uploadProfilePic,
  resetPasswordRequest,
  resetPassword,
  submitCryptoDeposit,
  verifyCryptoDeposit
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Handle __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🖼️ File upload setup (multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder honi chahiye project root mein
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// 📤 Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password-request", resetPasswordRequest);
router.post("/reset-password", resetPassword);

// 🔐 Protected Routes
router.post("/deposit", authMiddleware, depositFunds);
router.post("/withdraw", authMiddleware, withdrawFunds);
router.get("/me", authMiddleware, getMe);
router.patch("/update-username", authMiddleware, updateUsername);
router.post("/upload-profile-pic", authMiddleware, upload.single("profilePic"), uploadProfilePic);

// 🔐 New Crypto Deposit Routes
router.post("/submit-crypto-deposit", authMiddleware, submitCryptoDeposit);
router.post("/verify-crypto-deposit", authMiddleware, verifyCryptoDeposit);

export default router;
