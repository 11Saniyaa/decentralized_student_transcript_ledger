# Simple Setup Guide 🚀

## What You Need (Minimal!)

For **local development**, you only need:
1. ✅ **MongoDB** running locally (or use MongoDB Atlas if you prefer)
2. ✅ **Node.js** installed
3. ✅ That's it! No API keys needed for local development!

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running on your machine:
```bash
# If installed locally, MongoDB usually runs automatically
# Or start it manually if needed
```

### 2. Start Local Blockchain (Hardhat Node)
```bash
cd contract
npx hardhat node
```
Keep this terminal running! This creates a local blockchain.

### 3. Deploy Contract (in new terminal)
```bash
cd contract
npm run deploy:local
```
Copy the contract address shown and add to `backend/.env`:
```
CONTRACT_ADDRESS=0x... (the address from deployment)
```

### 4. Copy Contract Artifacts
```bash
cd backend
node scripts/copy-artifacts.js
```

### 5. Start Backend
```bash
cd backend
npm run dev
```

### 6. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

### 7. Open Browser
Go to: http://localhost:3000

## Environment Files (Already Created!)

### `contract/.env`
✅ **Empty is fine!** No API keys needed for local development.

### `backend/.env`
✅ **Minimal setup:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/transcript-ledger
CONTRACT_ADDRESS=0x... (add after deploying contract)
```

### `frontend/.env.local`
✅ **Optional** - defaults to localhost:5000

## Optional: Use Pinata for Real IPFS

If you want to use real IPFS (instead of local file storage), add to `backend/.env`:
```env
PINATA_API_KEY=your_key
PINATA_SECRET_API_KEY=your_secret
```

Get keys from: https://app.pinata.cloud/

## Optional: Deploy to Sepolia Testnet

If you want to use Sepolia testnet instead of local blockchain, add to `.env` files:
- `ALCHEMY_SEPOLIA_URL` (get from https://dashboard.alchemy.com/)
- `PRIVATE_KEY` (your wallet private key)
- `CONTRACT_ADDRESS` (after deployment)

## That's It! 🎉

No complex API setup needed for local development. Everything works locally!

