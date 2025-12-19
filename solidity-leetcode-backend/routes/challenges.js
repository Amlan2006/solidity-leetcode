import express from 'express';
import fs from 'fs';
import { join } from 'path';
import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get all active challenges (public)
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .select('title description difficulty category tags slug createdAt')
      .sort({ createdAt: -1 });
    
    res.json({ challenges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific challenge details (public)
router.get('/:slug', async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json({ challenge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit solution (requires auth)
router.post('/:slug/submit', authenticateUser, async (req, res) => {
  try {
    const { code } = req.body;
    const challenge = await Challenge.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const startTime = Date.now();

    // Import the runFoundry function for proper testing
    const { runFoundry } = await import('../runFoundry.js');
    const { createTempChallengeForTesting } = await import('../utils/fileManager.js');
    
    // Create temporary challenge files with user code
    const tempChallengeId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await createTempChallengeForTesting(challenge, code, tempChallengeId);

    // Run tests using Foundry/solc
    const result = await runFoundry(tempChallengeId, true);
    
    // Clean up temporary files
    const tempPath = join(process.cwd(), 'solidity-leetcode-backend', 'temp', tempChallengeId);
    try {
      if (fs.existsSync(tempPath)) {
        fs.rmSync(tempPath, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp directory:', cleanupError.message);
    }
    const executionTime = Date.now() - startTime;

    // Save submission
    const submission = new Submission({
      userId: req.clerkUserId,
      challengeId: challenge._id,
      code,
      status: result.success ? 'passed' : 'failed',
      testResults: result.output || result.error,
      executionTime
    });

    await submission.save();

    // Update user submission count
    await User.findOneAndUpdate(
      { clerkUserId: req.clerkUserId },
      { $inc: { submissionsCount: 1 } }
    );

    res.json({
      success: result.success,
      output: result.output,
      error: result.error,
      submissionId: submission._id,
      executionTime
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's submissions for a challenge (requires auth)
router.get('/:slug/submissions', authenticateUser, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ slug: req.params.slug });
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const submissions = await Submission.find({
      userId: req.clerkUserId,
      challengeId: challenge._id
    }).sort({ createdAt: -1 }).limit(10);

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;