import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  submissionsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);