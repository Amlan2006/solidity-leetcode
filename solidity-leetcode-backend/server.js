import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes, { publicRouter } from "./routes/admin.js";
import challengeRoutes from "./routes/challenges.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solidity-leetcode')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Check Solidity compiler availability
import { exec } from 'child_process';
exec("npx solcjs --version", (err, stdout) => {
  if (err) {
    console.error("❌ solcjs not available - Solidity compilation will fail");
  } else {
    console.log(`✅ solcjs ready (version: ${stdout.trim()})`);
  }
});

exec("forge --version", (err, stdout) => {
  if (err) {
    console.log("⚠️  Foundry not installed - using solcjs fallback");
  } else {
    console.log(`✅ Foundry available (${stdout.split('\n')[0]})`);
  }
});

// Routes
app.use('/admin', adminRoutes);
app.use('/challenges', challengeRoutes);
app.use('/user', publicRouter);

// Legacy endpoint for backward compatibility
app.get("/challenges", (req, res) => {
  // Redirect to new endpoint
  res.redirect('/challenges');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
