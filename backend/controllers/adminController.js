// backend/controllers/adminController.js
import CryptoDeposit from "../models/CryptoDeposit.js";
import User from "../models/user.js";

// ✅ Get all deposits (optional)
export const getAllCryptoDeposits = async (req, res) => {
  try {
    const deposits = await CryptoDeposit.find()
      .populate("user", "email username")
      .sort({ createdAt: -1 });
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching deposits" });
  }
};

// ✅ Get only pending deposits
export const getAllPendingDeposits = async (req, res) => {
  try {
    const deposits = await CryptoDeposit.find({ status: "pending" })
      .populate("user", "email username")
      .sort({ createdAt: -1 });
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching pending deposits" });
  }
};
// ✅ Approve deposit
export const verifyDepositByAdmin = async (req, res) => {
  const depositId = req.params.id;

  try {
    const deposit = await CryptoDeposit.findById(depositId);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({ message: "Deposit already processed" });
    }

    const user = await User.findById(deposit.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += deposit.amount;
    await user.save();

    deposit.status = "approved";
    deposit.reviewedBy = req.user.email;
    await deposit.save();

    res.json({ message: "Deposit approved" });
  } catch (err) {
    console.error("❌ Error approving deposit:", err);
    res.status(500).json({ message: "Server error approving deposit" });
  }
};

// ✅ Reject deposit
export const rejectDepositByAdmin = async (req, res) => {
  const depositId = req.params.id;

  try {
    const deposit = await CryptoDeposit.findById(depositId);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({ message: "Deposit already processed" });
    }

    deposit.status = "rejected";
    deposit.reviewedBy = req.user.email;
    await deposit.save();

    res.json({ message: "Deposit rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error rejecting deposit" });
  }
};
