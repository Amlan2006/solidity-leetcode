# LeetCode for Solidity

A minimal web platform for practicing Solidity coding challenges, similar to LeetCode but for smart contract development.

## Features

- Write Solidity code directly in the browser
- Submit solutions and get instant feedback
- Run Foundry tests automatically
- See test results (PASS/FAIL) with console output

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Foundry** - Install globally:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

## Setup

### 1. Install Foundry (if not already installed)

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Set up the challenge folder

Navigate to the challenge directory and initialize Foundry:

```bash
cd backend/challenges/two-sum
forge init --no-commit
forge install foundry-rs/forge-std
```

**Note:** The `--no-commit` flag prevents Foundry from initializing a git repository, which is useful if you're already in a git repo.

### 3. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Running the Application

### 1. Start the backend server

In one terminal:
```bash
cd backend
node server.js
```

The backend will run on `http://localhost:3001`

### 2. Start the frontend development server

In another terminal:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Open your browser

Navigate to `http://localhost:3000` and start coding!

## How It Works

1. **User writes code** in the Monaco Editor (pre-filled with function signature)
2. **Clicks "Submit"** button
3. **Backend receives** the code via POST request
4. **Template replacement** - User code is inserted into `Solution.sol.template`
5. **Foundry test execution** - `forge test` runs in the challenge directory
6. **Results returned** - PASS/FAIL status and console output displayed

## Project Structure

```
solidity-leetcode/
├── frontend/                 # Next.js app
│   ├── app/
│   │   ├── page.tsx          # Main challenge page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   └── CodeEditor.tsx    # Monaco Editor component
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── challenges/
│   │   └── two-sum/
│   │       ├── foundry.toml
│   │       ├── Solution.sol.template  # Template with {{USER_CODE}} placeholder
│   │       ├── Test.t.sol             # Foundry test cases
│   │       └── lib/                   # forge-std library
│   ├── server.js             # Express server
│   ├── runFoundry.js         # Foundry execution script
│   └── package.json
└── README.md
```

## Current Challenge: Two Sum

The platform currently includes one challenge:

**Two Sum** - Find two indices in an array that sum to a target value.

The solution function signature:
```solidity
function twoSum(uint[] memory nums, uint target) public pure returns (uint, uint)
```

## Example Solution

```solidity
function twoSum(uint[] memory nums, uint target) public pure returns (uint, uint) {
    for (uint i = 0; i < nums.length; i++) {
        for (uint j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return (i, j);
            }
        }
    }
    revert("No solution found");
}
```

## Troubleshooting

### Foundry not found
Make sure Foundry is installed and in your PATH:
```bash
forge --version
```

### Port already in use
- Backend: Change port in `backend/server.js` (default: 3001)
- Frontend: Change port in `frontend/package.json` scripts or use `npm run dev -- -p 3002`

### Test timeout
If tests take longer than 5 seconds, increase the timeout in `backend/runFoundry.js`

## Next Steps

Potential enhancements for future phases:
- Docker sandbox for secure code execution
- Gas usage scoring
- Multiple challenges
- Leaderboards
- User authentication
- Code submission history

## License

MIT

