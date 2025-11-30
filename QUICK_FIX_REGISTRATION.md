# Quick Fix: Student Registration Not Working

## 🔴 Main Issues

1. **Port 5000 already in use** - Changed to port 5001
2. **MongoDB not running** - Need to start MongoDB or use cloud

## ✅ Quick Fixes

### Fix 1: Kill Old Process (Port Conflict)

**Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Or simply change port:**
- Backend now uses port **5001** instead of 5000
- Update frontend `.env.local`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5001
  ```

### Fix 2: Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows: Start MongoDB service
# Search for "Services" → Find "MongoDB" → Start

# Or run manually:
mongod
```

**Option B: MongoDB Atlas (Easiest - No Installation!)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create free cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Update `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/transcript-ledger?retryWrites=true&w=majority
   ```

### Fix 3: Test Registration Directly

Run the test script:
```bash
cd backend
node test-registration.js
```

This will:
- ✅ Test MongoDB connection
- ✅ Create a test student
- ✅ Verify it's saved
- ✅ Show clear error messages

## 🚀 Step-by-Step Fix

### 1. Update Frontend Config

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 2. Start MongoDB

**Choose one:**
- **Local:** Start MongoDB service
- **Atlas:** Get connection string and update `backend/.env`

### 3. Restart Backend

```bash
cd backend
npm run dev
```

Should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5001
```

### 4. Restart Frontend

```bash
cd frontend
npm run dev
```

### 5. Test Registration

1. Go to http://localhost:3000
2. Login as Institution
3. Register Student
4. Fill form and submit

## 🧪 Alternative: Test Without Frontend

Test the API directly:

```bash
# Using curl (if installed)
curl -X POST http://localhost:5001/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "studentPRN": "PRN001",
    "email": "john@example.edu",
    "department": "CSE",
    "year": "2024"
  }'
```

**Or use the test script:**
```bash
cd backend
node test-registration.js
```

## 🔍 Verify It's Working

### Check Backend Terminal
```
✅ Connected to MongoDB
🚀 Server running on port 5001
```

### Check Browser Console (F12)
- No CORS errors
- POST request returns 201 status
- Response shows "Student created successfully"

### Check Network Tab (F12 → Network)
- Request to `/api/students` succeeds
- Response status: 201 Created
- Response body has student data

## 📝 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Port 5000 already in use` | Changed to port 5001, or kill old process |
| `MongoDB connection error` | Start MongoDB or use Atlas |
| `ECONNREFUSED` | MongoDB not running |
| `EADDRINUSE` | Port conflict - use different port |
| `Student with PRN exists` | Use different PRN |

## ✅ Success Checklist

- [ ] MongoDB running (local or Atlas)
- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Frontend `.env.local` updated to port 5001
- [ ] No errors in backend terminal
- [ ] No errors in browser console
- [ ] Registration form submits successfully

## 🎯 Quick Test Command

```bash
# Test MongoDB connection and registration
cd backend
node test-registration.js
```

This will tell you exactly what's wrong!

