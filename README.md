# Decentralized Student Transcript Ledger

Blockchain-based system for managing and verifying student transcripts using Ethereum smart contracts and IPFS storage.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Contract
cd contract && npm install
```

### 2. Setup Environment

Copy `.env.example` files to `.env` in each directory and fill in your values:
- `backend/.env` - Add Pinata API keys and contract address
- `frontend/.env` - Set `NEXT_PUBLIC_API_URL=http://localhost:5001`

### 3. Run the Application

**Terminal 1 - Hardhat Node:**
```bash
cd contract && npx hardhat node
```

**Terminal 2 - Deploy Contract:**
```bash
cd contract && npx hardhat run scripts/deploy-local.js --network localhost
```
Copy contract address to `backend/.env`

**Terminal 3 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 4 - Frontend:**
```bash
cd frontend && npm run dev
```

## 📖 Usage

- **Institution Login:** `http://localhost:3000/login/institution` (username: `viit`, password: `viit`)
- **Student Login:** `http://localhost:3000/login/student` (PRN: `22420303`, password: `studentpass`)
- Connect MetaMask to Hardhat Local network (Chain ID: 1337)

## 🔐 Security

- **Never commit `.env` files** - They contain API keys
- Use `.env.example` files as templates
- Keep your Pinata API keys secret

## 📁 Project Structure

```
├── backend/     # Express.js API
├── frontend/    # Next.js frontend
└── contract/    # Solidity smart contracts
```

## 📝 API Endpoints

- `POST /api/students` - Register student
- `GET /api/students` - List all students
- `POST /api/transcripts` - Upload transcript
- `GET /api/transcripts/:prn` - Get transcripts by PRN

## 🛠️ Technologies

- Frontend: Next.js, React, TypeScript, ethers.js
- Backend: Node.js, Express
- Blockchain: Solidity, Hardhat
- Storage: Pinata IPFS, Local JSON files

## 📄 License

MIT License
