import mongoose, { Schema } from 'mongoose';

const PushSubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true }
  },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, { timestamps: true });

PushSubscriptionSchema.index({ userId: 1 });

export default mongoose.model('PushSubscription', PushSubscriptionSchema);