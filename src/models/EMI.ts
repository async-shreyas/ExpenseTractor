import mongoose, { Schema } from 'mongoose';

const EMISchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  institution: { type: String, required: true },
  principal: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  emiAmount: { type: Number, required: true },
  dueDayOfMonth: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Index for performance
EMISchema.index({ userId: 1, active: 1 });

export default mongoose.model('EMI', EMISchema);