import { exec, spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function runFoundry(challengeName, isTemp = false) {
  return new Promise((resolve) => {
    const basePath = isTemp ? "temp" : "challenges";
    const challengePath = join(__dirname, basePath, challengeName);
    const solutionPath = join(challengePath, "src", "Solution.sol");
    const fallbackSolutionPath = join(challengePath, "Solution.sol");
    
    // Check if Solution.sol exists in src/ or root directory
    if (!fs.existsSync(solutionPath) && !fs.existsSync(fallbackSolutionPath)) {
      resolve({
        success: false,
        output: "Solution.sol not found in challenge directory (checked both src/ and root)",
      });
      return;
    }

    // Try to use forge first (if available), otherwise fall back to solcjs
    exec(
      `forge --version`,
      { timeout: 5000, cwd: challengePath },
      (err) => {
        if (err) {
          // Foundry not available, use solcjs fallback
          compileSolidityFallback(challengePath, resolve);
        } else {
          // Foundry available, use forge test
          exec(
            `forge test`,
            { timeout: 10000, cwd: challengePath },
            (err, stdout, stderr) => {
              if (err) {
                resolve({
                  success: false,
                  output: stderr || stdout,
                });
              } else {
                resolve({
                  success: true,
                  output: stdout,
                });
              }
            }
          );
        }
      }
    );
  });
}

function compileSolidityFallback(challengePath, resolve) {
  const solutionPath = join(challengePath, "src", "Solution.sol");
  const fallbackSolutionPath = join(challengePath, "Solution.sol");
  
  // Determine which Solution.sol file to use
  const actualSolutionPath = fs.existsSync(solutionPath) ? solutionPath : fallbackSolutionPath;
  
  if (!fs.existsSync(actualSolutionPath)) {
    resolve({
      success: false,
      output: "Solution.sol not found in either src/ or root directory",
    });
    return;
  }
  
  // Use npx solcjs for Windows compatibility
  const solc = spawn(
    "npx",
    ["solcjs", "--bin", "--abi", actualSolutionPath],
    {
      cwd: challengePath,
      shell: true, // Required for Windows
      timeout: 10000
    }
  );

  let stdout = "";
  let stderr = "";

  solc.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  solc.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  solc.on("close", (code) => {
    if (code !== 0) {
      resolve({
        success: false,
        output: `Compilation failed (exit code ${code}): ${stderr || stdout}`,
      });
    } else {
      // Check if compilation artifacts were created
      const binFiles = fs.readdirSync(challengePath).filter(f => f.endsWith('.bin'));
      const abiFiles = fs.readdirSync(challengePath).filter(f => f.endsWith('.abi'));
      
      resolve({
        success: true,
        output: `✅ Solidity compilation successful!\n\nGenerated files:\n- ${binFiles.length} .bin files\n- ${abiFiles.length} .abi files\n\n${stdout}\n\nNote: Full testing requires Foundry. Install with: curl -L https://foundry.paradigm.xyz | bash`,
      });
    }
  });

  solc.on("error", (error) => {
    resolve({
      success: false,
      output: `Compilation process error: ${error.message}`,
    });
  });
}
