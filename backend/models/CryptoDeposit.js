import mongoose from 'mongoose';

const cryptoDepositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be greater than 0']
  },
  coin: {
    type: String,
    enum: ['usdt', 'btc', 'bnb'], // match lowercase values from frontend
    required: true
  },
  txId: {
    type: String,
    required: true,
    unique: true // optional but good to avoid duplicates
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: String,
    default: null // admin email or name who reviewed
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

export default mongoose.model('CryptoDeposit', cryptoDepositSchema);
