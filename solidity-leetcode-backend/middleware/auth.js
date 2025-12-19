import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token with Clerk
    const payload = await clerkClient.verifyToken(token);
    
    if (!payload || !payload.sub) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get or create user in our database
    let user = await User.findOne({ clerkUserId: payload.sub });
    
    if (!user) {
      // Get user details from Clerk
      const clerkUser = await clerkClient.users.getUser(payload.sub);
      
      // Check if this is the first user - if so, make them admin
      const userCount = await User.countDocuments();
      const role = userCount === 0 ? 'admin' : 'user';
      
      user = new User({
        clerkUserId: payload.sub,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        role
      });
      
      await user.save();
    }

    req.user = user;
    req.clerkUserId = payload.sub;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};