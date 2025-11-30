# 🔧 Fix: Transaction Hash Not Generated

## ❌ Current Error

**Error:** `The requested account and/or method has not been authorized by the user` (Code: 4100)

This means:
- MetaMask transaction was **rejected** or **not approved**
- OR MetaMask is not connected to the correct network

## ✅ Solutions

### Solution 1: Approve Transaction in MetaMask (Most Common)

When you upload a transcript:

1. **MetaMask popup will appear** - Don't close it!
2. **Click "Confirm" or "Approve"** in the MetaMask popup
3. **Wait for transaction to complete** (usually 1-2 seconds)
4. **Hash will be generated automatically**

**If you accidentally rejected:**
- Upload the transcript again
- This time, click "Confirm" in MetaMask

### Solution 2: Connect MetaMask to Correct Network

**For Local Hardhat Network:**

1. Open MetaMask
2. Click network dropdown (top of MetaMask)
3. Click "Add Network" or "Add a network manually"
4. Enter:
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://localhost:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
5. Click "Save"
6. Switch to "Hardhat Local" network

**Important:** Make sure Hardhat node is running:
```bash
cd contract
npx hardhat node
```

### Solution 3: Connect Wallet Before Uploading

1. Go to "Create Transcript" page
2. Click **"Connect MetaMask"** button
3. Approve connection in MetaMask
4. You should see: "Wallet Connected: 0x..."
5. **Then** upload transcript

### Solution 4: Check Hardhat Node is Running

**Terminal 1 (Hardhat Node):**
```bash
cd contract
npx hardhat node
```

**Keep this running!** You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

## 🔍 How to Verify It's Working

### Step 1: Check MetaMask Connection

1. Open "Create Transcript" page
2. Look for: "Wallet Connected: 0x..." (if connected)
3. If not connected, click "Connect MetaMask"

### Step 2: Upload Transcript

1. Search for a student
2. Select file and fill form
3. Click "Upload Transcript"
4. **MetaMask popup appears** → Click "Confirm"
5. Wait for success message

### Step 3: Check Transaction Hash

**In Frontend:**
- Should see: "✅ Transcript uploaded and verified on blockchain! Hash: 0x..."

**In Backend Console:**
- Should see transaction hash logged

**In Database:**
- Open `backend/data/transcripts.json`
- Look for: `"txHash": "0x..."` (should have actual hash, not empty)

## 📋 Step-by-Step Checklist

- [ ] Hardhat node is running (`npx hardhat node`)
- [ ] MetaMask is installed and unlocked
- [ ] MetaMask is connected to Hardhat Local network (Chain ID: 1337)
- [ ] Wallet is connected in frontend (shows "Wallet Connected")
- [ ] When uploading, MetaMask popup appears
- [ ] You click "Confirm" in MetaMask popup
- [ ] Transaction completes successfully
- [ ] Hash appears in database

## 🆘 Common Issues

### "Transaction was rejected"
- **Fix:** Upload again and click "Confirm" in MetaMask

### "Please switch MetaMask to Hardhat Local network"
- **Fix:** Add Hardhat Local network to MetaMask (see Solution 2)

### "MetaMask is not connected"
- **Fix:** Click "Connect MetaMask" button first

### "Hardhat node not running"
- **Fix:** Start Hardhat node: `cd contract && npx hardhat node`

### "Contract address not configured"
- **Fix:** Check `backend/.env` has `CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3`

## 💡 Tips

1. **Keep Hardhat node running** - It's your local blockchain
2. **Don't close MetaMask popup** - Click "Confirm" instead
3. **Check network** - Must be "Hardhat Local" (Chain ID: 1337)
4. **Connect wallet first** - Before uploading transcript
5. **Wait for confirmation** - Transaction takes 1-2 seconds

## ✅ After Fix

Once working, you should see:
- ✅ MetaMask popup appears when uploading
- ✅ Transaction hash generated: `0x...`
- ✅ Hash stored in database
- ✅ Frontend shows "verified on blockchain" message

