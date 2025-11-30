const express = require("express");
const router = express.Router();

// Get contract address
router.get("/contract-address", (req, res) => {
  const contractAddress = process.env.CONTRACT_ADDRESS || "";
  
  if (!contractAddress) {
    return res.status(404).json({ 
      error: "Contract address not configured",
      message: "Please set CONTRACT_ADDRESS in backend/.env"
    });
  }
  
  res.json({ 
    address: contractAddress,
    network: process.env.ALCHEMY_SEPOLIA_URL ? "sepolia" : "localhost"
  });
});

module.exports = router;

