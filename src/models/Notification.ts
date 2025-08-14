import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['reminder', 'payment', 'system'], default: 'reminder' },
  readAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);