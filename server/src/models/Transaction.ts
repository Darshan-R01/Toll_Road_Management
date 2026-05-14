import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  // Only allows valid Karnataka plates (e.g., KA01AB1234)
  vehicleNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    match: [/^KA\d{2}[A-Z]{1,2}\d{4}$/, 'Please provide a valid Karnataka license plate']
  },
  plazaName: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['deduct', 'credit'], required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);