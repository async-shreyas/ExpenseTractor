// src/models/Expense.ts
import mongoose, { Schema } from 'mongoose';

const ExpenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  receiptUrl: { type: String },
  currency: { type: String, default: 'INR' },
  deletedAt: { type: Date }
}, { timestamps: true });

// Index for performance
ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Expense', ExpenseSchema);