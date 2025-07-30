// models/crashGameModel.js
import mongoose from 'mongoose';

const crashGameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  result: String,
  multiplier: Number,
  cashOutAt: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('CrashGame', crashGameSchema);
