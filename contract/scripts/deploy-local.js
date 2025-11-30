const hre = require("hardhat");

async function main() {
  console.log("Deploying TranscriptLedger to local Hardhat node...");
  console.log("Make sure Hardhat node is running: npx hardhat node");

  const TranscriptLedger = await hre.ethers.getContractFactory("TranscriptLedger");
  const transcriptLedger = await TranscriptLedger.deploy();

  await transcriptLedger.waitForDeployment();

  const address = await transcriptLedger.getAddress();
  console.log("\n✅ TranscriptLedger deployed to:", address);
  console.log("\n📝 Add this to backend/.env:");
  console.log("   CONTRACT_ADDRESS=" + address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

