import mongoose, { Schema } from 'mongoose';

const ReminderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  nextRunAt: { type: Date, required: true },
  entityType: { type: String, enum: ['expense', 'emi', 'loan'] },
  entityId: { type: Schema.Types.ObjectId },
  email: { type: Boolean, default: false },
  inApp: { type: Boolean, default: true },
  webPush: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  lastRunAt: { type: Date },
  runCount: { type: Number, default: 0 }
}, { timestamps: true });

// Index for performance
ReminderSchema.index({ active: 1, nextRunAt: 1 });

export default mongoose.model('Reminder', ReminderSchema);