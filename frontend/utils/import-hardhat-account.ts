// Helper to import Hardhat account into MetaMask
export interface ImportAccountResult {
  success: boolean
  message: string
  address?: string
}

export async function importHardhatAccount(accountIndex: number = 0): Promise<ImportAccountResult> {
  // Hardhat default accounts with their private keys
  const hardhatAccounts = [
    {
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      name: 'Account #0'
    },
    {
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      name: 'Account #1'
    },
    {
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
      name: 'Account #2'
    },
  ]

  const account = hardhatAccounts[accountIndex]
  if (!account) {
    return {
      success: false,
      message: `Account #${accountIndex} not found. Available: 0-${hardhatAccounts.length - 1}`
    }
  }

  // Copy private key to clipboard
  try {
    await navigator.clipboard.writeText(account.privateKey)
    return {
      success: true,
      message: `Private key for ${account.name} copied to clipboard! Now import it in MetaMask:\n\n1. Open MetaMask\n2. Click account icon → "Import Account"\n3. Paste the private key\n4. Click "Import"`,
      address: account.address
    }
  } catch (error) {
    return {
      success: true,
      message: `To import ${account.name}:\n\n1. Open MetaMask\n2. Click account icon → "Import Account"\n3. Paste this private key:\n${account.privateKey}\n4. Click "Import"`,
      address: account.address
    }
  }
}

export function getHardhatAccountInfo(accountIndex: number = 0) {
  const accounts = [
    {
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      name: 'Account #0',
      balance: '10,000 ETH'
    },
    {
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      name: 'Account #1',
      balance: '10,000 ETH'
    },
    {
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
      name: 'Account #2',
      balance: '10,000 ETH'
    },
  ]

  return accounts[accountIndex] || accounts[0]
}

