// API endpoint to fund a MetaMask account with ETH
const express = require('express')
const router = express.Router()
const { fundAccount } = require('../utils/fundAccount')

router.post('/', async (req, res) => {
  try {
    const { address, amount } = req.body
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' })
    }
    
    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address format' })
    }
    
    const amountInEther = amount || '1.0'
    
    console.log(`📥 Funding request: ${address} with ${amountInEther} ETH`)
    
    const result = await fundAccount(address, amountInEther)
    
    if (result.success) {
      res.json({
        success: true,
        message: `Successfully funded ${address} with ${amountInEther} ETH`,
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        balance: result.balance
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to fund account'
      })
    }
  } catch (error) {
    console.error('Error in fund endpoint:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    })
  }
})

module.exports = router

