const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

let contractInstance = null;
let provider = null;
let signer = null;

async function getContract() {
  if (contractInstance) {
    return contractInstance;
  }

  // Try to get contract address from environment or auto-detect from artifacts
  let contractAddress = process.env.CONTRACT_ADDRESS;
  
  // If not set, try to read from deployment artifacts (for local Hardhat node)
  if (!contractAddress) {
    try {
      // Try to read from Hardhat deployment artifacts
      const deploymentPath = path.join(__dirname, "../../contract/deployments/localhost/TranscriptLedger.json");
      if (fs.existsSync(deploymentPath)) {
        const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
        contractAddress = deployment.address;
        console.log(`📝 Auto-detected contract address from deployments: ${contractAddress}`);
      } else {
        console.warn("⚠️  CONTRACT_ADDRESS not set. For local development:");
        console.warn("   1. Start Hardhat node: cd contract && npx hardhat node");
        console.warn("   2. Deploy contract: cd contract && npx hardhat run scripts/deploy-local.js --network localhost");
        console.warn("   3. Add CONTRACT_ADDRESS=0x... to backend/.env");
        return null;
      }
    } catch (error) {
      console.warn("⚠️  CONTRACT_ADDRESS not set. On-chain features will not work.");
      console.warn("   See SETUP_CONTRACT.md for setup instructions.");
      return null;
    }
  }

  // Read ABI from artifacts (try backend artifacts first, then contract artifacts)
  let abiPath = path.join(__dirname, "../contract-artifacts/TranscriptLedger.json");
  
  // If not in backend, try contract directory
  if (!fs.existsSync(abiPath)) {
    abiPath = path.join(__dirname, "../../contract/artifacts/contracts/TranscriptLedger.sol/TranscriptLedger.json");
  }
  
  let abi;
  try {
    const artifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    abi = artifact.abi;
  } catch (error) {
    // Fallback ABI if file doesn't exist
    abi = [
      "function issueTranscript(string memory prn, string memory ipfsCid, string memory docName) public",
      "function getTranscripts(string memory prn) public view returns (tuple(string ipfsCid, string docName, string studentPRN, address issuer, uint256 timestamp)[])",
      "function getTranscriptCount(string memory prn) public view returns (uint256)",
      "function getTranscriptByIndex(string memory prn, uint256 index) public view returns (tuple(string ipfsCid, string docName, string studentPRN, address issuer, uint256 timestamp))",
      "event TranscriptIssued(string indexed prn, string ipfsCid, address indexed issuer, uint256 timestamp, bytes32 docHash)"
    ];
  }

  // Use local Hardhat node by default, or Sepolia if configured
  const rpcUrl = process.env.ALCHEMY_SEPOLIA_URL || process.env.INFURA_SEPOLIA_URL || "http://localhost:8545";
  const isLocal = !process.env.ALCHEMY_SEPOLIA_URL && !process.env.INFURA_SEPOLIA_URL;

  provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // For local Hardhat node, use default account (no private key needed)
  // For Sepolia, private key is required
  let signer;
  if (isLocal) {
    // Use first account from Hardhat node (for local development)
    // Hardhat node provides accounts automatically
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      // Get the address string, not the signer object
      const accountAddress = accounts[0];
      signer = await provider.getSigner(accountAddress);
      console.log(`📝 Using local Hardhat node account: ${accountAddress}`);
    } else {
      // Fallback: use a default private key for local testing
      signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
      console.log("📝 Using default Hardhat account for local development");
    }
  } else {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY is required when using Sepolia testnet");
    }
    signer = new ethers.Wallet(privateKey, provider);
  }

  contractInstance = new ethers.Contract(contractAddress, abi, signer);

  return contractInstance;
}

async function issueTranscriptOnChain(prn, ipfsCid, docName) {
  try {
    const contract = await getContract();
    if (!contract) {
      throw new Error("Contract not initialized. Check environment variables.");
    }
    const tx = await contract.issueTranscript(prn, ipfsCid, docName);
    const receipt = await tx.wait();
    
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error("Error issuing transcript on-chain:", error);
    throw error;
  }
}

module.exports = {
  getContract,
  issueTranscriptOnChain,
};
