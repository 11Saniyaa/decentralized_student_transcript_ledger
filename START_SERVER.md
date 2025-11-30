# 🚀 Start Server - Quick Guide

## ⚠️ Port Conflict Issue

If you see "Port 5001 is already in use", follow these steps:

## ✅ Quick Fix

### Step 1: Kill Process on Port 5001

**Option A: Use the script**
```bash
cd backend
powershell -ExecutionPolicy Bypass -File kill-port.ps1
```

**Option B: Manual**
```bash
# Find the process
netstat -ano | findstr :5001

# Kill it (replace <PID> with the number from above)
taskkill /PID <PID> /F
```

### Step 2: Start Backend

```bash
cd backend
npm run dev
```

**Should see:**
```
📁 Using file-based storage (no MongoDB needed!)
🚀 Server running on port 5001
✅ Ready to accept requests!
```

### Step 3: Start Frontend

**In a NEW terminal:**
```bash
cd frontend
npm run dev
```

## 🧪 Test Connection

**In browser:**
1. Go to http://localhost:3000
2. Open DevTools (F12) → Console tab
3. Try registering a student
4. Should work now! ✅

## 🔍 If Still Not Working

### Check Backend is Running:
```bash
curl http://localhost:5001/api/health
```

**Should return:**
```json
{"status":"ok","message":"Server is running"}
```

### Check Frontend Can Reach Backend:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try registering
4. Look for request to `http://localhost:5001/api/students`
5. Check status code (should be 201)

## ✅ Everything Should Work Now!

After killing the port conflict and restarting, registration should work!

