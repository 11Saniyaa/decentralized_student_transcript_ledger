# 🚨 QUICK FIX - Registration Not Working

## 🔴 The Problem

Your server is running but **MongoDB authentication is failing** because the password placeholder `<db_password>` hasn't been replaced with your actual password.

## ✅ Fix in 2 Steps

### Step 1: Update MongoDB Password

**Option A: Use the helper script (Easiest)**
```bash
cd backend
node update-password.js
```
Enter your MongoDB Atlas password when prompted.

**Option B: Manual Edit**
1. Open `backend/.env` file
2. Find this line:
   ```env
   MONGO_URI=mongodb+srv://11saniyajadhav_db_user:<db_password>@cluster0.vkrdlcg.mongodb.net/...
   ```
3. Replace `<db_password>` with your actual MongoDB Atlas password
4. Save the file

### Step 2: Test Connection

```bash
cd backend
node fix-and-test.js
```

This will:
- ✅ Test MongoDB connection
- ✅ Test student registration
- ✅ Show clear errors if something's wrong

## 🚀 After Password is Fixed

### Restart Backend
```bash
cd backend
npm run dev
```

**Should see:**
```
✅ Connected to MongoDB
🚀 Server running on port 5001
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Test Registration
1. Go to http://localhost:3000
2. Login as Institution
3. Register Student
4. **Should work now!** ✅

## 🔍 Current Status

From your terminal:
- ✅ Server running on port 5001
- ❌ MongoDB authentication failing
- ❌ Registration won't work until password is fixed

## 📝 Example .env Format

After updating, your MONGO_URI should look like:
```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:MyActualPassword123@cluster0.vkrdlcg.mongodb.net/transcript-ledger?retryWrites=true&w=majority
```

**NOT:**
```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:<db_password>@cluster0.vkrdlcg.mongodb.net/...
```

## ✅ Quick Test Command

```bash
cd backend
node fix-and-test.js
```

This will tell you exactly what's wrong and test everything!

