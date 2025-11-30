# ⚡ Quick Contract Setup (3 Steps)

## 🎯 Goal: Enable Transaction Hash Generation

Currently, your transcripts are uploaded to Pinata IPFS but **no transaction hashes** are generated because `CONTRACT_ADDRESS` is not set.

## 📋 Steps

### 1️⃣ Start Hardhat Node

**Open Terminal 1:**
```bash
cd contract
npx hardhat node
```

**Keep this running!** You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### 2️⃣ Deploy Contract

**Open Terminal 2 (new terminal):**
```bash
cd contract
npx hardhat run scripts/deploy-local.js --network localhost
```

**You'll see output like:**
```
✅ TranscriptLedger deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Copy that address!** (starts with `0x`)

### 3️⃣ Add to Backend .env

**Option A: Use the setup script**
```bash
cd backend
node setup-contract.js
```
Then paste the contract address when prompted.

**Option B: Manual**
1. Open `backend/.env` (create if it doesn't exist)
2. Add this line:
   ```env
   CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```
   (Replace with YOUR contract address from step 2)

### 4️⃣ Restart Backend

```bash
cd backend
npm run dev
```

## ✅ Test It!

1. Go to: Institution Dashboard → Create Transcript
2. Upload a new transcript
3. Check backend console - should see transaction hash!
4. Check the transcript in database - `txHash` should be filled

## 🔍 Verify It's Working

**Before:**
- Terminal: `CONTRACT_ADDRESS not set, skipping on-chain transaction`
- Database: `"txHash": ""`

**After:**
- Terminal: Transaction hash generated
- Database: `"txHash": "0x..."` (actual hash)

## 📝 Important Notes

- **Hardhat Node must be running** for transactions to work
- **Only NEW transcripts** will get hashes (old ones won't)
- **Local blockchain** - no real ETH needed
- **MetaMask not required** - backend uses Hardhat accounts

## 🆘 Troubleshooting

**Error: "connect ECONNREFUSED"**
- Make sure Hardhat node is running (Step 1)

**Error: "Contract not deployed"**
- Run deployment script again (Step 2)

**Still no hashes:**
- Check `backend/.env` has `CONTRACT_ADDRESS=0x...`
- Restart backend after adding address
- Make sure Hardhat node is still running

