import express from "express";
import {
  getAllCryptoDeposits,
  getAllPendingDeposits,
  verifyDepositByAdmin,
  rejectDepositByAdmin,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/deposits", authMiddleware, getAllCryptoDeposits);
router.get("/pending-deposits", authMiddleware, getAllPendingDeposits);
router.post("/verify/:id", authMiddleware, verifyDepositByAdmin);
router.post("/reject/:id", authMiddleware, rejectDepositByAdmin);

export default router;
