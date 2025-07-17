import express from "express";
import {
  getAllCryptoDeposits,
  getAllPendingDeposits,
  verifyDepositByAdmin,
  rejectDepositByAdmin,
} from "../controllers/adminController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All deposits: approved, pending, canceled
router.get("/deposits", authMiddleware, adminOnly, getAllCryptoDeposits);

// ✅ Optional: only pending deposits
router.get("/pending-deposits", authMiddleware, adminOnly, getAllPendingDeposits);

// ✅ Approve deposit
router.post("/verify/:id", authMiddleware, adminOnly, verifyDepositByAdmin);

// ✅ Cancel deposit
router.post("/reject/:id", authMiddleware, adminOnly, rejectDepositByAdmin);

export default router;
