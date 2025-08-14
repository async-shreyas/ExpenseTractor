import mongoose, { Schema } from 'mongoose';

const EmailLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['sent', 'failed', 'bounced'], required: true },
  provider: { type: String, required: true },
  error: { type: String },
  retryCount: { type: Number, default: 0 },
  sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

EmailLogSchema.index({ userId: 1, sentAt: -1 });

export default mongoose.model('EmailLog', EmailLogSchema);