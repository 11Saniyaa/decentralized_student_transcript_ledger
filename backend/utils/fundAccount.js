// Utility to fund a MetaMask account with ETH from Hardhat default account
const { ethers } = require('ethers')

async function fundAccount(recipientAddress, amountInEther = '1.0') {
  try {
    // Connect to local Hardhat node
    const rpcUrl = process.env.HARDHAT_RPC_URL || 'http://localhost:8545'
    console.log(`🔗 Connecting to Hardhat node at ${rpcUrl}...`)
    
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    
    // Check if provider is connected
    try {
      const blockNumber = await provider.getBlockNumber()
      console.log(`✅ Connected! Current block: ${blockNumber}`)
    } catch (err) {
      throw new Error(`Cannot connect to Hardhat node at ${rpcUrl}. Make sure it's running: cd contract && npx hardhat node`)
    }
    
    // Use Hardhat Account #0 (has 10,000 ETH)
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    const signer = new ethers.Wallet(privateKey, provider)
    
    // Check sender balance
    const senderBalance = await provider.getBalance(signer.address)
    console.log(`💰 Sender balance: ${ethers.formatEther(senderBalance)} ETH`)
    
    if (senderBalance < ethers.parseEther(amountInEther)) {
      throw new Error(`Insufficient balance. Sender has ${ethers.formatEther(senderBalance)} ETH, trying to send ${amountInEther} ETH`)
    }
    
    console.log(`💸 Funding account ${recipientAddress} with ${amountInEther} ETH...`)
    console.log(`   From: ${signer.address}`)
    
    // Send ETH
    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: ethers.parseEther(amountInEther)
    })
    
    console.log(`   Transaction hash: ${tx.hash}`)
    console.log(`   Waiting for confirmation...`)
    
    // Wait for confirmation
    const receipt = await tx.wait()
    console.log(`✅ Successfully funded! Block: ${receipt.blockNumber}`)
    
    // Check balance
    const balance = await provider.getBalance(recipientAddress)
    console.log(`   New balance: ${ethers.formatEther(balance)} ETH`)
    
    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      balance: ethers.formatEther(balance)
    }
  } catch (error) {
    console.error('❌ Error funding account:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

module.exports = { fundAccount }

