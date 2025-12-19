import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: String, // Clerk user ID
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['passed', 'failed', 'error'],
    required: true
  },
  testResults: {
    type: mongoose.Schema.Types.Mixed // Store test output
  },
  executionTime: Number // in milliseconds
}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ userId: 1, challengeId: 1 });
submissionSchema.index({ createdAt: -1 });

export default mongoose.model('Submission', submissionSchema);