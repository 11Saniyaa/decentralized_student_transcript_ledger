const hre = require("hardhat");

async function main() {
  const networkName = hre.network.name;
  console.log("Deploying TranscriptLedger to", networkName, "network...");

  const TranscriptLedger = await hre.ethers.getContractFactory("TranscriptLedger");
  const transcriptLedger = await TranscriptLedger.deploy();

  await transcriptLedger.waitForDeployment();

  const address = await transcriptLedger.getAddress();
  console.log("\n✅ TranscriptLedger deployed to:", address);
  
  if (networkName === "localhost" || networkName === "hardhat") {
    console.log("\n📝 For local development, add this to backend/.env:");
    console.log("   CONTRACT_ADDRESS=" + address);
    console.log("\n💡 Or start Hardhat node and deploy:");
    console.log("   Terminal 1: npx hardhat node");
    console.log("   Terminal 2: npx hardhat run scripts/deploy.js --network localhost");
  } else {
    console.log("\n📝 Add this address to your backend .env file as CONTRACT_ADDRESS=" + address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
