# 🔍 MetaMask Wallet & Transaction Hash Status

## Current Status

### 1. **MetaMask Wallet Connection** ✅

**Frontend (UI):**
- ✅ MetaMask connection UI is implemented
- ✅ Shows "Connect MetaMask" button on Register Student and Create Transcript pages
- ✅ Displays wallet address when connected
- ⚠️ **However:** The wallet connection is **only for display** - it's not actually used for blockchain transactions

**Backend (Transactions):**
- ⚠️ **MetaMask is NOT used for transactions**
- Backend uses its own signer from:
  - Environment variables (`PRIVATE_KEY`) for Sepolia testnet
  - OR Hardhat local node accounts for local development
- The frontend wallet connection is separate from backend transaction signing

### 2. **Transaction Hash Generation** ❌

**Current Status:**
- ❌ **NO transaction hashes are being generated**
- Reason: `CONTRACT_ADDRESS` is not set in `backend/.env`
- Terminal shows: `CONTRACT_ADDRESS not set, skipping on-chain transaction`
- All transcripts have empty `txHash: ""` and `blockNumber: 0`

**How It Should Work:**
1. Upload transcript PDF to Pinata IPFS ✅ (Working)
2. Get IPFS CID ✅ (Working)
3. Call smart contract `issueTranscript()` ❌ (Skipped - no contract address)
4. Get transaction hash from blockchain ❌ (Not happening)
5. Store hash in database ❌ (Stored as empty string)

## 🔧 How to Enable Transaction Hashes

### Option 1: Use Local Hardhat Node (Easiest)

1. **Start Hardhat node:**
   ```bash
   cd contract
   npx hardhat node
   ```
   (Keep this running in a terminal)

2. **Deploy contract:**
   ```bash
   cd contract
   npx hardhat run scripts/deploy-local.js --network localhost
   ```
   Copy the contract address from output

3. **Add to `backend/.env`:**
   ```env
   CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```

4. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```

### Option 2: Use Sepolia Testnet

1. **Get Alchemy/Infura URL:**
   - Sign up at https://www.alchemy.com/
   - Create Sepolia app
   - Copy HTTP URL

2. **Get private key:**
   - Export from MetaMask (Account → Account Details → Export Private Key)
   - ⚠️ **Keep this secret!**

3. **Deploy to Sepolia:**
   ```bash
   cd contract
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Add to `backend/.env`:**
   ```env
   ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=0xYourPrivateKey
   CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```

## 📊 Check Current Status

### Check if Wallet is Connected (Frontend):
1. Go to: Institution Dashboard → Register Student or Create Transcript
2. Look for: "Wallet Connected: 0x..." (if connected) OR "Connect MetaMask" button
3. Click "Connect MetaMask" to connect

### Check Transaction Hashes (Backend):
```bash
# View stored transcripts
cat backend/data/transcripts.json
```

Look for:
- `"txHash": ""` = No hash generated ❌
- `"txHash": "0x..."` = Hash generated ✅

## 🎯 Summary

| Feature | Status | Notes |
|---------|--------|-------|
| MetaMask UI | ✅ Working | Shows connection status |
| Wallet Used for TX | ❌ No | Backend uses own signer |
| Transaction Hashes | ❌ Not Generated | Need `CONTRACT_ADDRESS` |
| IPFS Upload | ✅ Working | Pinata uploads working |
| Data Storage | ✅ Working | Files stored in `backend/data/` |

## 🚀 Next Steps

To enable transaction hash generation:
1. Deploy smart contract (local or Sepolia)
2. Add `CONTRACT_ADDRESS` to `backend/.env`
3. Restart backend
4. Upload a new transcript - should see hash generated!

