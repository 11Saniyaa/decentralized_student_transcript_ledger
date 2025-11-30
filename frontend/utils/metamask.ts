import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: any
  }
}

export interface WalletInfo {
  address: string
  chainId: number
  isConnected: boolean
}

// Track pending connection requests to prevent duplicates
let pendingConnection: Promise<WalletInfo> | null = null

export async function connectMetaMask(): Promise<WalletInfo> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.')
  }

  // If there's already a pending connection, return that promise
  if (pendingConnection) {
    return pendingConnection
  }

  // Create new connection promise
  pendingConnection = (async () => {
    try {
      // Check if already connected
      const existingAccounts = await window.ethereum.request({
        method: 'eth_accounts',
      })
      
      if (existingAccounts.length > 0) {
        // Already connected - get full wallet info
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        })
        
        // Check if on correct network, if not, prompt to switch
        const currentChainId = parseInt(chainId, 16)
        if (currentChainId !== 1337 && currentChainId !== 11155111) {
          // Not on Hardhat Local or Sepolia - try to switch
          try {
            await switchToLocalNetwork()
            // Get updated chain ID after switch
            const newChainId = await window.ethereum.request({
              method: 'eth_chainId',
            })
            pendingConnection = null // Reset
            return {
              address,
              chainId: parseInt(newChainId, 16),
              isConnected: true,
            }
          } catch (switchError: any) {
            // If user rejects switch, still return connection but warn
            pendingConnection = null // Reset
            return {
              address,
              chainId: currentChainId,
              isConnected: true,
            }
          }
        }
        
        pendingConnection = null // Reset
        return {
          address,
          chainId: currentChainId,
          isConnected: true,
        }
      }

      // Request account access (only if not already connected)
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const currentChainId = parseInt(chainId, 16)

      // Check if on correct network, if not, prompt to switch
      if (currentChainId !== 1337 && currentChainId !== 11155111) {
        try {
          await switchToLocalNetwork()
          // Get updated chain ID after switch
          const newChainId = await window.ethereum.request({
            method: 'eth_chainId',
          })
          pendingConnection = null // Reset
          return {
            address,
            chainId: parseInt(newChainId, 16),
            isConnected: true,
          }
        } catch (switchError: any) {
          // If user rejects switch, still return connection
          pendingConnection = null // Reset
          return {
            address,
            chainId: currentChainId,
            isConnected: true,
          }
        }
      }

      pendingConnection = null // Reset
      return {
        address,
        chainId: currentChainId,
        isConnected: true,
      }
    } catch (error: any) {
      pendingConnection = null // Reset on error
      if (error.code === 4001) {
        throw new Error('User rejected the connection request.')
      }
      // Handle "already pending" error
      if (error.message?.includes('already pending') || error.code === -32002) {
        // Wait a bit and try again with existing accounts
        await new Promise(resolve => setTimeout(resolve, 1000))
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          })
          return {
            address,
            chainId: parseInt(chainId, 16),
            isConnected: true,
          }
        }
        throw new Error('Please approve the pending MetaMask request first.')
      }
      throw error
    }
  })()

  return pendingConnection
}

export async function getWalletAddress(): Promise<string | null> {
  if (!window.ethereum) {
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    })

    if (accounts.length > 0) {
      return accounts[0]
    }
    return null
  } catch (error) {
    console.error('Error getting wallet address:', error)
    return null
  }
}

export async function getWalletInfo(): Promise<WalletInfo | null> {
  if (!window.ethereum) {
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    })

    if (accounts.length === 0) {
      return null
    }

    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    })

    return {
      address: accounts[0],
      chainId: parseInt(chainId, 16),
      isConnected: true,
    }
  } catch (error) {
    console.error('Error getting wallet info:', error)
    return null
  }
}

export async function switchToLocalNetwork() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed')
  }

  const chainId = '0x539' // 1337 in hex for Hardhat local

  try {
    // Try to switch to the network first
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    })
  } catch (switchError: any) {
    // If network doesn't exist (error code 4902), add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainId,
              chainName: 'Hardhat Local',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['http://localhost:8545'],
              blockExplorerUrls: null,
            },
          ],
        })
      } catch (addError: any) {
        // User rejected the request
        if (addError.code === 4001) {
          throw new Error('User rejected network addition')
        }
        throw addError
      }
    } else if (switchError.code === 4001) {
      // User rejected the switch
      throw new Error('User rejected network switch')
    } else {
      throw switchError
    }
  }
}

export function onAccountsChanged(callback: (accounts: string[]) => void) {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback)
  }
}

export function onChainChanged(callback: (chainId: string) => void) {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback)
  }
}

