import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import path from "path";
import CryptoDeposit from '../models/CryptoDeposit.js';
import User from '../models/user.js';

// ========================= REGISTER =========================
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      balance: 0,
      totalDeposited: 0
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================= LOGIN =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean(); // .lean() makes it a plain JS object
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });

    // Remove password before sending to frontend
    delete user.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username || "",
        profilePic: user.profilePic || "",
        isAdmin: user.isAdmin || false,
        balance: user.balance || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// ========================= DEPOSIT =========================
export const depositFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Deposit amount must be greater than 0" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.balance += amount;
    user.totalDeposited += amount;
    await user.save();

    res.status(200).json({
      message: "Deposit successful",
      newBalance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================= CRYPTO DEPOSIT =========================
let pendingDeposits = [];

const WALLET_ADDRESSES = {
  usdt: "TYyeJuVT6WAJ62zANYDiZkaXfMMc8UCcML",
  bnb: "0x169510d670F116C9723F03C8E3EaE11F7f1fc6e5",
  btc: "bc1qhegxttdq2qzc79cks073rpna32mnl5tz3ejrs8"
};

export const submitCryptoDeposit = async (req, res) => {
  try {
    const { amount, coin, txId } = req.body;

    if (!amount || !coin || !txId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new deposit and mark it as approved immediately
    const newDeposit = await CryptoDeposit.create({
      userId: req.user._id,
      amount,
      coin: coin.toUpperCase(),
      txId,
      status: 'approved',
      reviewedBy: 'system' // Optional: system auto-approved
    });

    // Update user's balance immediately
    const user = await User.findById(req.user._id);
    user.balance += parseFloat(amount);
    await user.save();

    res.status(201).json({ message: "Deposit submitted and auto-approved ✅", newBalance: user.balance });
  } catch (err) {
    console.error("Deposit error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyCryptoDeposit = async (req, res) => {
  const { txId } = req.body;
  const userId = req.user.id;

  const index = pendingDeposits.findIndex(dep => dep.txId === txId && dep.userId === userId);

  if (index === -1) {
    return res.status(404).json({ message: "Transaction not found or not pending." });
  }

  const deposit = pendingDeposits[index];
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.balance += parseFloat(deposit.amount);
  user.totalDeposited += parseFloat(deposit.amount);
  await user.save();

  pendingDeposits.splice(index, 1);

  res.status(200).json({
    message: "Deposit verified and balance updated.",
    newBalance: user.balance
  });
};

// ========================= WITHDRAW =========================
export const withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Withdraw amount must be greater than 0" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.totalDeposited < 50) {
      return res.status(400).json({
        message: "You must deposit at least $50 before making a withdrawal."
      });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    user.balance -= amount;
    await user.save();

    res.status(200).json({
      message: "Withdrawal successful",
      newBalance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================= GET PROFILE =========================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username || "",
      profilePic: user.profilePic || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================= UPDATE USERNAME =========================
export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username is required." });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    );

    res.status(200).json({
      message: "Username updated successfully",
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating username", error: err.message });
  }
};

// ========================= UPLOAD PROFILE PIC =========================
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicUrl: imageUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading profile picture", error: err.message });
  }
};

// ========================= PASSWORD RESET REQUEST (EMAIL) =========================
export const resetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required." });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found." });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    html: `<p>Click this link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
  });

  res.status(200).json({ message: "Reset link sent to email." });
};

// ========================= RESET PASSWORD WITH TOKEN =========================
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token." });

  user.password = await hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful." });
};
