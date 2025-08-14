import mongoose, { Schema } from 'mongoose';

const LoanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  institution: { type: String, required: true },
  principal: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'repaid', 'defaulted'], default: 'active' }
}, { timestamps: true });

// Index for performance
LoanSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Loan', LoanSchema);