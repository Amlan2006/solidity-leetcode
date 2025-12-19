import express from 'express';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { createChallengeFiles, testChallenge } from '../utils/fileManager.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authenticateUser);
router.use(requireAdmin);

// Get all challenges (including inactive)
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json({ challenges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new challenge
router.post('/challenges', async (req, res) => {
  try {
    const { title, description, difficulty, category, templateCode, testCode, tags } = req.body;
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const challenge = new Challenge({
      title,
      description,
      difficulty,
      category,
      templateCode,
      testCode,
      createdBy: req.clerkUserId,
      tags: tags || [],
      slug,
      isActive: true // Set as active by default
    });

    await challenge.save();
    
    // Create challenge files on filesystem
    await createChallengeFiles(challenge);
    
    res.status(201).json({ challenge });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update challenge
router.put('/challenges/:id', async (req, res) => {
  try {
    const { title, description, difficulty, category, templateCode, testCode, tags, isActive } = req.body;
    
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        difficulty,
        category,
        templateCode,
        testCode,
        tags,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Update challenge files on filesystem
    await createChallengeFiles(challenge);
    
    res.json({ challenge });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete challenge
router.delete('/challenges/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // TODO: Remove challenge files from filesystem
    
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test challenge
router.post('/challenges/:id/test', async (req, res) => {
  try {
    const { testCode } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const result = await testChallenge(challenge, testCode);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test challenge code (for new challenges)
router.post('/challenges/test', async (req, res) => {
  try {
    const { templateCode, testCode } = req.body;
    
    // Create a temporary challenge object
    const tempChallenge = {
      slug: 'temp-test',
      templateCode,
      testCode
    };

    const result = await testChallenge(tempChallenge, testCode);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promote user to admin (only existing admins can do this)
router.post('/users/:userId/promote', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User promoted to admin successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for admin management)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-__v').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activate all challenges (admin only)
router.post('/challenges/activate-all', async (req, res) => {
  try {
    const result = await Challenge.updateMany({}, { isActive: true });
    res.json({ 
      message: `Successfully activated ${result.modifiedCount} challenges`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to see challenge details
router.get('/challenges/:slug/debug', async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ slug: req.params.slug });
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json({
      title: challenge.title,
      templateCode: challenge.templateCode,
      testCode: challenge.testCode
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

// Add a public route to check current user status (before admin middleware)
import express2 from 'express';
const publicRouter = express2.Router();

publicRouter.get('/me', authenticateUser, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { publicRouter };