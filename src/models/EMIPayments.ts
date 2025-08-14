import mongoose, { Schema } from 'mongoose';

const EMIPaymentSchema = new Schema({
  emiId: { type: Schema.Types.ObjectId, ref: 'EMI', required: true },
  paymentNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  emi: { type: Number, required: true },
  principalComponent: { type: Number, required: true },
  interestComponent: { type: Number, required: true },
  outstandingPrincipal: { type: Number, required: true },
  paidAt: { type: Date },
  status: { type: String, enum: ['pending', 'paid', 'missed'], default: 'pending' }
}, { timestamps: true });

// Index for performance
EMIPaymentSchema.index({ emiId: 1, dueDate: 1 });

export default mongoose.model('EMIPayment', EMIPaymentSchema);