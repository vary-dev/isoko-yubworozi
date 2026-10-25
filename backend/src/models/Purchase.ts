import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  provider: { type: String, enum: ['flutterwave', 'manual-mobile-money'], default: 'manual-mobile-money' },
  txRef: { type: String, required: true, unique: true, index: true },
  providerTransactionId: { type: String, sparse: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'RWF' },
  status: { type: String, enum: ['awaiting_payment', 'pending', 'pin_issued', 'successful', 'rejected', 'expired', 'failed', 'cancelled'], default: 'awaiting_payment', index: true },
  paymentMethod: { type: String, enum: ['mtn', 'airtel', 'card'] },
  payerPhone: String,
  submittedAmount: { type: Number, min: 0 },
  paymentMarkedAt: Date,
  verificationCodeHash: { type: String, select: false },
  verificationCodeExpiresAt: Date,
  verificationAttempts: { type: Number, default: 0 },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  rejectedReason: String,
  providerStatus: String,
  providerMessage: String,
  paidAt: Date,
}, { timestamps: true });

purchaseSchema.index({ user: 1, book: 1, status: 1 });

export default mongoose.model('Purchase', purchaseSchema);
