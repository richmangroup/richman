import mongoose from "mongoose";

// 📥 Embedded deposit schema
const depositSchema = new mongoose.Schema({
  coin: { type: String, required: true }, // e.g. USDT, BTC, BNB
  amount: { type: Number, required: true },
  txId: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

// 👤 User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  balance: {
    type: Number,
    default: 0,
  },

  totalDeposited: {
    type: Number,
    default: 0,
  },

  username: {
    type: String,
    default: "",
    trim: true,
  },

  profilePic: {
    type: String,
    default: "",
  },

  resetPasswordToken: {
    type: String,
    default: null,
  },

  resetPasswordExpires: {
    type: Date,
    default: null,
  },

  pendingDeposits: [depositSchema], // 👈 Embedded array of deposit records

  isAdmin: {
    type: Boolean,
    default: false, // 👈 By default, user is not admin
  }
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;
