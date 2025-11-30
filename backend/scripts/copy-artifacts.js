const fs = require("fs");
const path = require("path");

// Copy contract artifacts from contract directory to backend
const contractArtifactsPath = path.join(__dirname, "../../contract/artifacts/contracts/TranscriptLedger.sol/TranscriptLedger.json");
const backendArtifactsDir = path.join(__dirname, "../contract-artifacts");
const backendArtifactsPath = path.join(backendArtifactsDir, "TranscriptLedger.json");

try {
  // Create directory if it doesn't exist
  if (!fs.existsSync(backendArtifactsDir)) {
    fs.mkdirSync(backendArtifactsDir, { recursive: true });
  }

  // Check if source file exists
  if (!fs.existsSync(contractArtifactsPath)) {
    console.warn("Contract artifacts not found. Please compile the contract first:");
    console.warn("  cd contract && npm run compile");
    process.exit(0);
  }

  // Copy the file
  fs.copyFileSync(contractArtifactsPath, backendArtifactsPath);
  console.log("Contract artifacts copied successfully to backend/contract-artifacts/");
} catch (error) {
  console.error("Error copying artifacts:", error.message);
  process.exit(1);
}
