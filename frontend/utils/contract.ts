import { ethers } from 'ethers'

// Contract ABI (minimal - only functions we need)
const CONTRACT_ABI = [
  "function issueTranscript(string memory prn, string memory ipfsCid, string memory docName) public",
  "function getTranscripts(string memory prn) public view returns (tuple(string ipfsCid, string docName, string studentPRN, address issuer, uint256 timestamp)[])",
  "function getTranscriptCount(string memory prn) public view returns (uint256)",
  "event TranscriptIssued(string indexed prn, string ipfsCid, address indexed issuer, uint256 timestamp, bytes32 docHash)"
]

// Get contract address from backend or use default
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

// Track pending transactions to prevent duplicates
let pendingTransaction: Promise<{ txHash: string; blockNumber: number }> | null = null

export async function issueTranscriptOnChain(
  contractAddress: string,
  prn: string,
  ipfsCid: string,
  docName: string
): Promise<{ txHash: string; blockNumber: number }> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.')
  }

  // If there's already a pending transaction, wait for it
  if (pendingTransaction) {
    throw new Error('A transaction is already pending. Please wait for it to complete.')
  }

  // Check if MetaMask is connected
  const accounts = await window.ethereum.request({ method: 'eth_accounts' })
  if (accounts.length === 0) {
    throw new Error('MetaMask is not connected. Please connect your wallet first.')
  }

  // Check if connected to the right network (for local Hardhat)
  const chainId = await window.ethereum.request({ method: 'eth_chainId' })
  const expectedChainId = '0x539' // 1337 in hex for local Hardhat
  const sepoliaChainId = '0xaa36a7' // 11155111 in hex for Sepolia
  
  if (chainId !== expectedChainId && chainId !== sepoliaChainId) {
    // Try to switch to local network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: expectedChainId }],
      })
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: expectedChainId,
            chainName: 'Hardhat Local',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['http://localhost:8545'],
          }],
        })
      } else {
        throw new Error(`Please switch to Hardhat Local network (Chain ID: 1337) or Sepolia. Current: ${parseInt(chainId, 16)}`)
      }
    }
  }

  // Create transaction promise
  pendingTransaction = (async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer)

      // Call the contract function - this will trigger MetaMask popup
      const tx = await contract.issueTranscript(prn, ipfsCid, docName)
      
      // Wait for transaction to be mined
      const receipt = await tx.wait()

      pendingTransaction = null // Reset after completion
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error: any) {
      pendingTransaction = null // Reset on error
      // Handle "already pending" error
      if (error.message?.includes('already pending') || error.code === -32002) {
        throw new Error('A MetaMask request is already pending. Please approve or reject it first, then try again.')
      }
      throw error
    }
  })()

  return pendingTransaction
}

export async function getContractAddress(): Promise<string> {
  // Try to get from backend API
  try {
    const response = await fetch('http://localhost:5001/api/contract-address')
    if (response.ok) {
      const data = await response.json()
      return data.address
    }
  } catch (error) {
    console.warn('Could not fetch contract address from backend')
  }
  
  // Fallback to environment variable
  return CONTRACT_ADDRESS
}

