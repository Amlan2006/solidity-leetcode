import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { runFoundry } from "./runFoundry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Get list of available challenges
app.get("/challenges", (req, res) => {
  const challengesDir = join(__dirname, "challenges");
  const challenges = fs.readdirSync(challengesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  res.json({ challenges });
});

app.post("/submit", async (req, res) => {
  const { code, challenge } = req.body;

  if (!challenge) {
    return res.status(400).json({ success: false, output: "Challenge name is required" });
  }

  const templatePath = join(__dirname, "challenges", challenge, "Solution.sol.template");
  const solutionPath = join(__dirname, "challenges", challenge, "Solution.sol");

  // Check if challenge exists
  if (!fs.existsSync(templatePath)) {
    return res.status(404).json({ success: false, output: `Challenge "${challenge}" not found` });
  }

  try {
    const template = fs.readFileSync(templatePath, "utf8");
    const finalCode = template.replace("{{USER_CODE}}", code);
    fs.writeFileSync(solutionPath, finalCode);

    const result = await runFoundry(challenge);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      output: `Error: ${error.message}`,
    });
  }
});

app.listen(3001, () => {
  console.log("Backend server running on http://localhost:3001");
});
