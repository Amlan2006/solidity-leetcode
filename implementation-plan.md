# Dynamic Challenge Management Implementation Plan

## 1. Database Schema Design

### Challenges Table
```sql
- id (UUID/ObjectId)
- title (String)
- description (Text)
- difficulty (Enum: Easy, Medium, Hard)
- category (String)
- template_code (Text) - The Solution.sol.template content
- test_code (Text) - The Test.t.sol content
- created_by (User ID - admin who created it)
- created_at (DateTime)
- updated_at (DateTime)
- is_active (Boolean)
- tags (Array of strings)
```

### Users Table (extend Clerk user data)
```sql
- clerk_user_id (String - from Clerk)
- role (Enum: user, admin)
- created_at (DateTime)
- submissions_count (Integer)
```

### Submissions Table (optional - for tracking user progress)
```sql
- id (UUID)
- user_id (String - Clerk ID)
- challenge_id (UUID)
- code (Text)
- status (Enum: passed, failed)
- test_results (JSON)
- submitted_at (DateTime)
```

## 2. Backend API Endpoints to Add

### Admin Endpoints (protected by role check)
- POST /admin/challenges - Create new challenge
- PUT /admin/challenges/:id - Update challenge
- DELETE /admin/challenges/:id - Delete challenge
- GET /admin/challenges - Get all challenges (including inactive)
- POST /admin/challenges/:id/test - Test a challenge before publishing

### User Endpoints (update existing)
- GET /challenges - Get active challenges (update existing)
- GET /challenges/:id - Get specific challenge details
- POST /challenges/:id/submit - Submit solution (update existing)

### Auth Middleware
- Clerk webhook handler for user creation/updates
- Role-based access control middleware

## 3. Frontend Components to Create

### Admin Dashboard
- AdminLayout component
- ChallengeForm component (create/edit)
- ChallengeList component (manage all challenges)
- TestRunner component (test challenges before publishing)

### User Interface Updates
- Dynamic challenge loading from database
- Challenge detail page improvements
- User progress tracking

## 4. File Structure Changes

### Backend
```
solidity-leetcode-backend/
├── models/
│   ├── Challenge.js
│   ├── User.js
│   └── Submission.js
├── middleware/
│   ├── auth.js
│   └── adminAuth.js
├── routes/
│   ├── challenges.js
│   ├── admin.js
│   └── auth.js
├── utils/
│   ├── foundryRunner.js
│   └── fileManager.js
└── server.js
```

### Frontend
```
solidity-leetcode-frontend/
├── app/
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── challenges/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   └── challenges/
│       └── [id]/page.tsx (update existing)
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── ChallengeForm.tsx
│   │   ├── ChallengeList.tsx
│   │   └── TestRunner.tsx
│   └── ui/ (reusable components)
└── hooks/
    ├── useAuth.ts
    └── useChallenges.ts
```