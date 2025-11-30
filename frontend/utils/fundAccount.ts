// Utility to fund MetaMask account with ETH from Hardhat
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export interface FundAccountResult {
  success: boolean
  message?: string
  txHash?: string
  blockNumber?: number
  balance?: string
  error?: string
}

export async function fundMyAccount(amount: string = '1.0'): Promise<FundAccountResult> {
  if (!window.ethereum) {
    return {
      success: false,
      error: 'MetaMask is not installed'
    }
  }

  try {
    // Get current account
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length === 0) {
      return {
        success: false,
        error: 'Please connect MetaMask first'
      }
    }

    const address = accounts[0]
    
    // Call backend API to fund the account
    const response = await fetch(`${API_URL}/api/fund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        amount
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fund account' }))
      return {
        success: false,
        error: errorData.error || `Server error: ${response.status} ${response.statusText}`
      }
    }

    const data = await response.json()
    
    if (data.success) {
      return {
        success: true,
        message: data.message,
        txHash: data.txHash,
        blockNumber: data.blockNumber,
        balance: data.balance
      }
    } else {
      return {
        success: false,
        error: data.error || 'Failed to fund account'
      }
    }
  } catch (error: any) {
    console.error('Fund account error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fund account. Make sure Hardhat node is running on http://localhost:8545'
    }
  }
}

