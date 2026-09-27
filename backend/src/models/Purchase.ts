import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  provider: { type: String, enum: ['flutterwave'], default: 'flutterwave' },
  txRef: { type: String, required: true, unique: true, index: true },
  providerTransactionId: { type: String, sparse: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'RWF' },
  status: { type: String, enum: ['pending', 'successful', 'failed', 'cancelled'], default: 'pending', index: true },
  paymentMethod: String,
  providerStatus: String,
  providerMessage: String,
  paidAt: Date,
}, { timestamps: true });

purchaseSchema.index({ user: 1, book: 1, status: 1 });

export default mongoose.model('Purchase', purchaseSchema);
