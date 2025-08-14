import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  emailVerified: { type: Date },
  accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
  sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
  preferences: {
    currency: { type: String, default: 'INR' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);