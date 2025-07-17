import CryptoDeposit from "../models/CryptoDeposit.js";
import User from "../models/user.js";

// ✅ Get all deposits (including auto-approved) with approvedBy info
export const getAllCryptoDeposits = async (req, res) => {
  try {
    const deposits = await CryptoDeposit.find()
      .populate("userId", "email username")
      .sort({ createdAt: -1 });

    // Add approvedBy field (admin email or 'Auto')
    const formatted = deposits.map(dep => ({
      ...dep._doc,
      approvedBy: dep.reviewedBy || "Auto"
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deposits", error: err.message });
  }
};

// ✅ Get only pending deposits
export const getAllPendingDeposits = async (req, res) => {
  try {
    const pending = await CryptoDeposit.find({ status: "pending" })
      .populate("userId", "email username");
    res.status(200).json(pending);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending deposits", error: err.message });
  }
};

// ✅ Approve a deposit
export const verifyDepositByAdmin = async (req, res) => {
  const depositId = req.params.id;

  try {
    const deposit = await CryptoDeposit.findById(depositId);
    if (!deposit || deposit.status !== "pending") {
      return res.status(400).json({ message: "Deposit not found or already processed." });
    }

    const user = await User.findById(deposit.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update deposit status
    deposit.status = "approved";
    deposit.reviewedBy = req.user.email; // ✅ admin email from token
    await deposit.save();

    // Update user's balance
    user.balance += deposit.amount;
    user.totalDeposited += deposit.amount;
    await user.save();

    res.status(200).json({ message: "Deposit approved and user balance updated." });
  } catch (err) {
    res.status(500).json({ message: "Error approving deposit", error: err.message });
  }
};

// ✅ Cancel a deposit
export const rejectDepositByAdmin = async (req, res) => {
  const depositId = req.params.id;

  try {
    const deposit = await CryptoDeposit.findById(depositId);
    if (!deposit || deposit.status !== "pending") {
      return res.status(400).json({ message: "Deposit not found or already processed." });
    }

    deposit.status = "canceled";
    deposit.reviewedBy = req.user.email;
    await deposit.save();

    res.status(200).json({ message: "Deposit has been canceled." });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting deposit", error: err.message });
  }
};
