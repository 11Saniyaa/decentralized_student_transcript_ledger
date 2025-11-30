# 🚀 Setup Contract for Transaction Hashes

## Quick Setup Guide

### Step 1: Start Hardhat Node (Terminal 1)

```bash
cd contract
npx hardhat node
```

**Keep this terminal running!** This starts a local blockchain.

### Step 2: Deploy Contract (Terminal 2)

In a **new terminal**:

```bash
cd contract
npx hardhat run scripts/deploy-local.js --network localhost
```

**Copy the contract address** from the output (looks like: `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

### Step 3: Add to Backend .env

**Open:** `backend/.env` (create if it doesn't exist)

**Add:**
```env
CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Step 4: Restart Backend

```bash
cd backend
npm run dev
```

### Step 5: Test

1. Upload a new transcript
2. Check backend console - should see transaction hash!
3. Check `backend/data/transcripts.json` - should have `txHash` filled in

## ✅ Verification

After setup, when you upload a transcript, you should see:
- ✅ Backend console: Transaction hash generated
- ✅ Database: `txHash` field filled with `0x...`
- ✅ Frontend: Shows "Verified" status instead of "Uploaded"

## 🔍 Current Status

- **Contract Compiled:** ✅ Yes
- **Hardhat Node:** ❓ Need to start
- **Contract Deployed:** ❓ Need to deploy
- **CONTRACT_ADDRESS Set:** ❌ Not set yet

## 📝 Notes

- **Local Hardhat Node:** Free, no real ETH needed
- **Transaction Hashes:** Will be generated for all NEW transcripts
- **Old Transcripts:** Won't get hashes (already uploaded)
- **MetaMask:** Not needed for backend transactions (uses Hardhat accounts)

