import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function runFoundry(challengeName) {
  return new Promise((resolve) => {
    const challengePath = join(__dirname, "challenges", challengeName);
    exec(
      `cd "${challengePath}" && forge test`,
      { timeout: 10000 },
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
  });
}
