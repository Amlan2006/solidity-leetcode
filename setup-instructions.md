# Setup Instructions for Dynamic Challenge Management

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd solidity-leetcode-backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```
   MONGODB_URI=mongodb://localhost:27017/solidity-leetcode
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   PORT=3001
   ```

3. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Make sure MongoDB is running on the URI specified in .env

4. **Start Backend**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Update Environment Variables**
   Add to your `.env.local` in the frontend:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

2. **Start Frontend**
   ```bash
   cd solidity-leetcode-frontend
   npm run dev
   ```

## Making a User Admin

Since you need admin access to create challenges, you'll need to manually set a user as admin in the database:

1. **Sign up/Login** to your app first to create a user record
2. **Connect to MongoDB** and find your user:
   ```javascript
   db.users.find({ email: "your-email@example.com" })
   ```
3. **Update user role**:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## Testing the System

1. **Access Admin Panel**: Go to `/admin` (only works if you're an admin)
2. **Create a Challenge**: Click "Create Challenge" and fill out the form
3. **Test Challenge**: Use the "Test Challenge" button to verify your tests work
4. **Publish Challenge**: Set `isActive: true` to make it visible to users
5. **User View**: Go to `/challenges` to see your published challenges

## API Endpoints

### Admin Endpoints (require admin role)
- `GET /admin/challenges` - Get all challenges
- `POST /admin/challenges` - Create new challenge
- `PUT /admin/challenges/:id` - Update challenge
- `DELETE /admin/challenges/:id` - Delete challenge
- `POST /admin/challenges/:id/test` - Test challenge

### User Endpoints
- `GET /challenges` - Get active challenges
- `GET /challenges/:slug` - Get specific challenge
- `POST /challenges/:slug/submit` - Submit solution
- `GET /challenges/:slug/submissions` - Get user's submissions

## File Structure Changes

The system now stores challenges in MongoDB instead of the filesystem. The old `challenges/` directory structure is still used for running tests, but challenges are dynamically created from the database.

## Next Steps

1. **Add more admin features**: User management, analytics, etc.
2. **Improve UI**: Better code editor, syntax highlighting for Solidity
3. **Add features**: Leaderboards, difficulty progression, hints
4. **Security**: Rate limiting, input validation, better auth checks
5. **Performance**: Caching, pagination for large numbers of challenges