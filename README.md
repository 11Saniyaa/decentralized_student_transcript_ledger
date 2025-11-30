# Decentralized Student Transcript Ledger

A blockchain-based system for managing and verifying student transcripts using Ethereum smart contracts, IPFS for document storage, and a modern web interface.

## 🚀 Features

- **Blockchain Verification**: Transcripts are recorded on Ethereum blockchain (Sepolia testnet or local Hardhat)
- **IPFS Storage**: Documents stored on Pinata IPFS for decentralized access
- **Institution Dashboard**: Register students and upload transcripts
- **Student Dashboard**: View and verify your own transcripts
- **MetaMask Integration**: Secure wallet-based transactions
- **File-based Storage**: No database required - uses local JSON files

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Pinata account (for IPFS storage)
- Hardhat (for local blockchain development)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/11Saniyaa/decentralized_student_transcript_ledger.git
cd decentralized_student_transcript_ledger
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**Contract:**
```bash
cd contract
npm install
```

### 3. Environment Setup

**Backend Environment (`backend/.env`):**
```env
# Server Configuration
PORT=5001
NODE_ENV=development
USE_FILE_STORAGE=true

# Pinata IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

# Smart Contract Configuration
CONTRACT_ADDRESS=your_contract_address
HARDHAT_RPC_URL=http://localhost:8545

# Optional: MongoDB (if not using file storage)
# MONGO_URI=your_mongodb_connection_string
```

**Frontend Environment (`frontend/.env`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

**Contract Environment (`contract/.env`):**
```env
# Optional: For Sepolia deployment
# ALCHEMY_SEPOLIA_URL=your_alchemy_url
# PRIVATE_KEY=your_private_key
```

**⚠️ Important:** Never commit `.env` files! They contain sensitive keys. Use `.env.example` files as templates.

## 🚀 Running the Application

### 1. Start Hardhat Node (Terminal 1)

```bash
cd contract
npx hardhat node
```

Keep this running - it's your local blockchain.

### 2. Deploy Contract (Terminal 2)

```bash
cd contract
npx hardhat run scripts/deploy-local.js --network localhost
```

Copy the contract address and add it to `backend/.env`:
```env
CONTRACT_ADDRESS=0xYourContractAddressHere
```

### 3. Start Backend Server (Terminal 3)

```bash
cd backend
npm run dev
```

Server will run on `http://localhost:5001`

### 4. Start Frontend (Terminal 4)

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📖 Usage

### Institution Login

1. Go to `http://localhost:3000/login/institution`
2. Username: `viit`
3. Password: `viit`
4. Click "Connect MetaMask" and approve connection
5. Switch MetaMask to "Hardhat Local" network (Chain ID: 1337)

### Register Student

1. Go to Institution Dashboard → Register Student
2. Fill in student details (Name, PRN, Email, Department, Year, DOB)
3. Click "Register Student"

### Upload Transcript

1. Go to Institution Dashboard → Create Transcript
2. Search for student by PRN
3. Select PDF file and fill in details
4. Click "Upload Transcript"
5. **Approve transaction in MetaMask popup** to generate blockchain hash

### Student Login

1. Go to `http://localhost:3000/login/student`
2. Enter PRN: `22420303`
3. Password: `studentpass`
4. View your transcripts with blockchain verification

## 🔧 Configuration

### Using File Storage (Default)

The application uses file-based storage by default (no database needed):
- Students: `backend/data/students.json`
- Transcripts: `backend/data/transcripts.json`

### Using MongoDB (Optional)

1. Set `USE_FILE_STORAGE=false` in `backend/.env`
2. Add your MongoDB connection string:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

### MetaMask Setup

1. Install MetaMask browser extension
2. Add Hardhat Local network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1337`
   - Currency: `ETH`
3. Connect wallet in the application

## 📁 Project Structure

```
decentralized_student_transcript_ledger/
├── backend/           # Express.js backend API
│   ├── data/         # File-based storage (JSON files)
│   ├── models/       # Data models
│   ├── routes/       # API routes
│   ├── utils/        # Utilities (IPFS, contract interaction)
│   └── server.js     # Main server file
├── frontend/         # Next.js frontend
│   ├── pages/        # Next.js pages
│   ├── utils/        # Frontend utilities (MetaMask)
│   └── styles/       # CSS styles
├── contract/         # Solidity smart contracts
│   ├── contracts/    # Smart contract source
│   ├── scripts/      # Deployment scripts
│   └── test/         # Contract tests
└── README.md         # This file
```

## 🔐 Security Notes

- **Never commit `.env` files** - They contain API keys and private keys
- Use `.env.example` files as templates
- Keep your Pinata API keys secret
- Never share your private keys
- Use testnet for development, mainnet only for production

## 🧪 Testing

### Test Smart Contract

```bash
cd contract
npx hardhat test
```

### Test Backend API

```bash
cd backend
npm test
```

## 📝 API Endpoints

- `POST /api/students` - Register a new student
- `GET /api/students` - Get all students
- `GET /api/students/:prn` - Get student by PRN
- `POST /api/transcripts` - Upload transcript
- `GET /api/transcripts` - Get all transcripts
- `GET /api/transcripts/:prn` - Get transcripts by PRN
- `GET /api/contract-address` - Get contract address

## 🛠️ Technologies Used

- **Frontend**: Next.js, React, TypeScript, ethers.js
- **Backend**: Node.js, Express, Multer
- **Blockchain**: Solidity, Hardhat, ethers.js
- **Storage**: Pinata IPFS, Local JSON files (or MongoDB)
- **Wallet**: MetaMask

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

## ⚠️ Important Notes

- This is a development/demo project
- Use testnet for testing
- Never commit sensitive keys to Git
- Always use `.env.example` as a template
- Keep your private keys secure
