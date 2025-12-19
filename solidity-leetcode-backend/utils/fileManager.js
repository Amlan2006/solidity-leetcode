import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function createChallengeFiles(challenge) {
  const challengePath = join(__dirname, '..', 'challenges', challenge.slug);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(challengePath)) {
    fs.mkdirSync(challengePath, { recursive: true });
  }

  // Write template file
  const templatePath = join(challengePath, 'Solution.sol.template');
  fs.writeFileSync(templatePath, challenge.templateCode);

  // Write test file
  const testPath = join(challengePath, 'Test.t.sol');
  fs.writeFileSync(testPath, challenge.testCode);

  // Create foundry.toml if it doesn't exist
  const foundryConfigPath = join(challengePath, 'foundry.toml');
  if (!fs.existsSync(foundryConfigPath)) {
    const foundryConfig = `[profile.default]
src = "src"
test = "test"
out = "out"
libs = ["lib"]
solc = "0.8.20"`;
    
    fs.writeFileSync(foundryConfigPath, foundryConfig);
  }

  // Initialize foundry project if lib doesn't exist
  const libPath = join(challengePath, 'lib');
  if (!fs.existsSync(libPath)) {
    try {
      // Try to install forge-std
      await execAsync(`cd "${challengePath}" && forge install foundry-rs/forge-std`);
    } catch (error) {
      console.error('Error installing forge-std:', error);
      // Create lib directory manually if forge fails
      fs.mkdirSync(libPath, { recursive: true });
      
      // Create minimal forge-std setup
      fs.mkdirSync(join(libPath, 'forge-std', 'src'), { recursive: true });
      const minimalTest = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    function assertTrue(bool condition, string memory message) internal pure {
        require(condition, message);
    }
    
    function assertEq(uint a, uint b, string memory message) internal pure {
        require(a == b, message);
    }
}

library console {
    function log(string memory message) internal pure {}
}`;
      fs.writeFileSync(join(libPath, 'forge-std', 'src', 'Test.sol'), minimalTest);
    }
  }

  // Create src and test directories
  const srcPath = join(challengePath, 'src');
  const testDirPath = join(challengePath, 'test');
  
  if (!fs.existsSync(srcPath)) {
    fs.mkdirSync(srcPath, { recursive: true });
  }
  
  if (!fs.existsSync(testDirPath)) {
    fs.mkdirSync(testDirPath, { recursive: true });
  }

  // Write the template to src/Solution.sol (where tests expect it)
  const srcSolutionPath = join(srcPath, 'Solution.sol');
  fs.writeFileSync(srcSolutionPath, challenge.templateCode);

  // Move test file to test directory
  const finalTestPath = join(testDirPath, 'Test.t.sol');
  if (fs.existsSync(testPath) && testPath !== finalTestPath) {
    fs.renameSync(testPath, finalTestPath);
  } else if (!fs.existsSync(finalTestPath)) {
    fs.writeFileSync(finalTestPath, challenge.testCode);
  }

  // Create README
  const readmePath = join(challengePath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    const readme = `# ${challenge.title}

## Description
${challenge.description}

**Difficulty:** ${challenge.difficulty}
**Category:** ${challenge.category}

## Usage

### Test
\`\`\`shell
forge test
\`\`\`

### Build
\`\`\`shell
forge build
\`\`\`
`;
    fs.writeFileSync(readmePath, readme);
  }
}

export async function createTempChallengeForTesting(challenge, userCode, tempChallengeId) {
  const tempPath = join(__dirname, '..', 'temp', tempChallengeId);
  
  // Create temp directory structure
  fs.mkdirSync(tempPath, { recursive: true });
  fs.mkdirSync(join(tempPath, 'src'), { recursive: true });
  fs.mkdirSync(join(tempPath, 'test'), { recursive: true });
  
  // Smart code extraction: handle both full contract and function body submissions
  let processedUserCode = userCode.trim();
  
  // Check if user submitted a full contract
  if (processedUserCode.includes('contract Solution') || processedUserCode.includes('pragma solidity')) {
    // Extract just the function body from the user's contract
    // Use a more precise regex that handles nested braces
    const functionMatch = processedUserCode.match(/function\s+twoSum[^{]*\{((?:[^{}]|\{[^{}]*\})*)\}/);
    if (functionMatch && functionMatch[1]) {
      processedUserCode = functionMatch[1].trim();
    } else {
      // If we can't extract the function body, use the full contract as-is
      // This means we skip the template and use user's complete code
      const solutionCode = processedUserCode;
      fs.writeFileSync(join(tempPath, 'src', 'Solution.sol'), solutionCode);
      
      // Write test file and continue setup
      fs.writeFileSync(join(tempPath, 'test', 'Test.t.sol'), challenge.testCode);
      setupFoundryProject(tempPath);
      return tempPath;
    }
  }
  
  // Replace user code in template
  const solutionCode = challenge.templateCode.replace('{{USER_CODE}}', processedUserCode);
  
  // Write Solution.sol to src directory
  fs.writeFileSync(join(tempPath, 'src', 'Solution.sol'), solutionCode);
  
  // Write test file and setup Foundry project
  fs.writeFileSync(join(tempPath, 'test', 'Test.t.sol'), challenge.testCode);
  setupFoundryProject(tempPath);
  
  return tempPath;
}

function setupFoundryProject(tempPath) {
  // Create foundry.toml
  const foundryConfig = `[profile.default]
src = "src"
test = "test"
out = "out"
libs = ["lib"]
solc = "0.8.20"`;
  
  fs.writeFileSync(join(tempPath, 'foundry.toml'), foundryConfig);
  
  // Create minimal lib structure for forge-std
  const libPath = join(tempPath, 'lib', 'forge-std', 'src');
  fs.mkdirSync(libPath, { recursive: true });
  
  const minimalTest = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    function assertTrue(bool condition, string memory message) internal pure {
        require(condition, message);
    }
    
    function assertEq(uint a, uint b, string memory message) internal pure {
        require(a == b, message);
    }
    
    function assertEq(uint a, uint b) internal pure {
        require(a == b, "Values should be equal");
    }
}

library console {
    function log(string memory message) internal pure {}
}`;
  
  fs.writeFileSync(join(libPath, 'Test.sol'), minimalTest);
}

export async function testChallenge(challenge, testCode) {
  const tempPath = join(__dirname, '..', 'temp', `test-${Date.now()}`);
  
  try {
    // Create temp directory
    fs.mkdirSync(tempPath, { recursive: true });
    
    // Use the provided template code (which should already have user code substituted)
    let solutionCode = challenge.templateCode;
    if (solutionCode.includes('{{USER_CODE}}')) {
      // This is for admin testing - provide a working solution
      solutionCode = challenge.templateCode.replace('{{USER_CODE}}', `
        for (uint i = 0; i < nums.length; i++) {
            for (uint j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return [i, j];
                }
            }
        }
        revert("No solution found");
      `);
    }
    
    // Write the solution file
    fs.writeFileSync(join(tempPath, 'Solution.sol'), solutionCode);
    
    // Try to compile the solution using npx solcjs (Windows-safe)
    try {
      const { stdout, stderr } = await execAsync(`npx solcjs --bin --abi Solution.sol`, { 
        timeout: 10000,
        cwd: tempPath
      });
      
      // Check if compilation succeeded by looking for output files
      const files = fs.readdirSync(tempPath);
      const binFiles = files.filter(f => f.endsWith('.bin'));
      const abiFiles = files.filter(f => f.endsWith('.abi'));
      
      if (binFiles.length > 0 || abiFiles.length > 0) {
        return {
          success: true,
          output: `✅ Compilation successful!\n\nGenerated:\n- ${binFiles.length} .bin files\n- ${abiFiles.length} .abi files\n\n${stdout}`,
          error: stderr
        };
      } else {
        return {
          success: false,
          output: stdout,
          error: `Compilation failed - no output files generated:\n${stderr}`
        };
      }
    } catch (compileError) {
      return {
        success: false,
        output: compileError.stdout || '',
        error: `Compilation failed: ${compileError.stderr || compileError.message}`
      };
    }
    
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error.message || 'Test execution failed'
    };
  } finally {
    // Clean up
    if (fs.existsSync(tempPath)) {
      fs.rmSync(tempPath, { recursive: true, force: true });
    }
  }
}