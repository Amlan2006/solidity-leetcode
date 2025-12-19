import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  templateCode: {
    type: String,
    required: true
  },
  testCode: {
    type: String,
    required: true
  },
  createdBy: {
    type: String, // Clerk user ID
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    unique: true,
    sparse: true // Allow null values but enforce uniqueness when present
  }
}, {
  timestamps: true
});

// Generate slug from title
challengeSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Challenge', challengeSchema);