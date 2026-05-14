import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  plazaName: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deduct', 'credit'], required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);