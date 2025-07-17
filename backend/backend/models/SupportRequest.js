import mongoose from 'mongoose';

const supportRequestSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SupportRequest = mongoose.model('SupportRequest', supportRequestSchema);

export default SupportRequest;
