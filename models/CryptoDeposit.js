import mongoose from 'mongoose';

const cryptoDepositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  coin: {
    type: String,
    enum: ['USDT', 'BTC', 'BNB'],
    required: true
  },
  txId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'canceled'], // ✅ updated terms
    default: 'pending'
  },
  reviewedBy: {
    type: String,
    default: null // ✅ admin email who verified/rejected
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

export default mongoose.model('CryptoDeposit', cryptoDepositSchema);
