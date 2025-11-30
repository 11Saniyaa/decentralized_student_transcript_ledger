# MetaMask Integration & Student Registration Fixes

## ✅ What Was Fixed

### 1. Student Registration Issues
- **Better error handling**: More detailed error messages
- **Input validation**: Email format validation, field trimming
- **CORS configuration**: Fixed CORS to allow frontend connections
- **MongoDB error handling**: Better error messages for connection issues

### 2. MetaMask Integration
- **Wallet connection**: Connect MetaMask wallet on Institution pages
- **Auto-detection**: Automatically detects if wallet is already connected
- **Account changes**: Listens for account/chain changes
- **Error handling**: Clear error messages for wallet connection issues

## 🔧 Changes Made

### Backend (`backend/`)
1. **routes/students.js**: Enhanced error handling and validation
2. **server.js**: Improved CORS configuration

### Frontend (`frontend/`)
1. **utils/metamask.ts**: New MetaMask utility functions
2. **pages/institution/register.tsx**: Added MetaMask connection UI
3. **pages/institution/create-transcript.tsx**: Added MetaMask connection UI
4. **package.json**: Added `ethers` dependency

## 🚀 How to Use MetaMask

### 1. Install MetaMask Extension
- Install from: https://metamask.io/
- Create or import a wallet

### 2. Connect to Local Hardhat Network (Optional)
If using local Hardhat node:
1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Network Name: `Hardhat Local`
4. RPC URL: `http://localhost:8545`
5. Chain ID: `31337`
6. Currency Symbol: `ETH`

### 3. Connect Wallet in App
1. Go to Institution Dashboard
2. Click "Register Student" or "Create Transcript"
3. Click "Connect MetaMask" button
4. Approve connection in MetaMask popup
5. Wallet address will be displayed when connected

## 🐛 Troubleshooting Student Registration

### Issue: "Failed to register student"
**Possible causes:**
1. **MongoDB not running**
   - Solution: Start MongoDB service
   - Check: `mongod` should be running

2. **Backend not running**
   - Solution: Run `cd backend && npm run dev`
   - Check: Should see "Server running on port 5000"

3. **CORS error**
   - Solution: Check `backend/.env` has correct `FRONTEND_URL`
   - Default: `http://localhost:3000`

4. **Duplicate PRN**
   - Solution: Use a different PRN (Primary Registration Number)
   - Error message will show: "Student with this PRN already exists"

5. **Invalid email format**
   - Solution: Use valid email format (e.g., `student@example.com`)

### Check Backend Logs
Look at the backend terminal for detailed error messages:
```bash
cd backend
npm run dev
```

### Check Browser Console
Open browser DevTools (F12) → Console tab to see frontend errors

## 📝 Testing Student Registration

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Registration:**
   - Go to http://localhost:3000
   - Click "Login as Institution"
   - Click "Register Student"
   - Connect MetaMask (optional but recommended)
   - Fill in the form:
     - Student Name: `John Doe`
     - Student PRN: `PRN2024001`
     - Email: `john.doe@example.edu`
     - Department: `CSE`
     - Year: `2024`
   - Click "Register Student"

## ✅ Success Indicators

- ✅ Green success message: "Student registered successfully!"
- ✅ Form clears after successful registration
- ✅ Student appears in database (can verify via MongoDB)

## 🔍 Verify Registration

Check if student was saved:
```bash
# Connect to MongoDB
mongosh

# Use database
use transcript-ledger

# Find students
db.students.find()
```

## 📞 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing required fields" | Empty required field | Fill all required fields |
| "Invalid email format" | Bad email | Use valid email format |
| "Student with this PRN already exists" | Duplicate PRN | Use different PRN |
| "MongoDB connection error" | MongoDB not running | Start MongoDB service |
| "Failed to connect wallet" | MetaMask not installed | Install MetaMask extension |

## 🎯 Next Steps

After successful registration:
1. Go to "Create Transcript" page
2. Search for the student by PRN
3. Upload a transcript PDF
4. View on Student Dashboard

MetaMask connection is optional but recommended for blockchain features!

