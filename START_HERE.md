# 🚀 START HERE - Fix Registration Issues

## ⚠️ Current Problems

1. **Port 5000 conflict** - Fixed: Changed to port 5001
2. **MongoDB not running** - Need to fix this

## ✅ Quick Fix (3 Steps)

### Step 1: Kill Old Process
```powershell
taskkill /PID 31924 /F
```

### Step 2: Start MongoDB

**EASIEST: Use MongoDB Atlas (Cloud - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Edit `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/transcript-ledger
   ```

**OR: Start Local MongoDB**
- Windows: Open Services → Find "MongoDB" → Start

### Step 3: Restart Everything

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🧪 Test Registration

### Option 1: Test Script (Easiest)
```bash
cd backend
node test-registration.js
```

This will:
- ✅ Test MongoDB connection
- ✅ Create test student
- ✅ Show clear errors if something's wrong

### Option 2: Use Frontend
1. Go to http://localhost:3000
2. Login as Institution
3. Register Student
4. Fill form and submit

## 📝 What Changed

- ✅ Backend port: 5000 → **5001**
- ✅ Frontend API URL: Updated to port 5001
- ✅ Added test script: `backend/test-registration.js`
- ✅ Better error messages

## 🔍 Verify It Works

**Backend should show:**
```
✅ Connected to MongoDB
🚀 Server running on port 5001
```

**If MongoDB not running:**
```
❌ MongoDB connection error
⚠️  Starting server anyway, but database operations will fail.
```

**Solution:** Start MongoDB or use Atlas!

## 🎯 Next Steps

1. **Kill old process** (if still running)
2. **Start MongoDB** (Atlas or local)
3. **Restart backend** - should connect to MongoDB
4. **Test registration** - should work now!

See `QUICK_FIX_REGISTRATION.md` for detailed troubleshooting.

