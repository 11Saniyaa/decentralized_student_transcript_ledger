# 🔍 Troubleshoot Registration Issues

## ✅ Backend is Working!

I've tested the backend API directly and it works perfectly:
- ✅ File storage is working
- ✅ Registration endpoint responds correctly
- ✅ Data is being saved

## 🔍 If Frontend Still Shows "Failed to Register"

### Step 1: Check Backend is Running

**Terminal should show:**
```
📁 Using file-based storage (no MongoDB needed!)
🚀 Server running on port 5001
✅ Ready to accept requests!
```

**If not running:**
```bash
cd backend
npm run dev
```

### Step 2: Check Browser Console

1. Open browser DevTools (Press **F12**)
2. Go to **Console** tab
3. Try registering a student
4. Look for error messages

**Common errors:**
- `Network Error` → Backend not running
- `CORS error` → CORS configuration issue
- `404 Not Found` → Wrong API URL
- `500 Internal Server Error` → Backend error (check backend console)

### Step 3: Check Network Tab

1. Open browser DevTools (Press **F12**)
2. Go to **Network** tab
3. Try registering a student
4. Find the request to `/api/students`
5. Click on it to see:
   - **Status Code**: Should be 201 (Success) or 400/500 (Error)
   - **Request Payload**: What data was sent
   - **Response**: What the server returned

### Step 4: Test API Directly

**In a new terminal:**
```bash
cd backend
node test-api.js
```

**Should see:**
```
✅✅✅ Registration API is working! ✅✅✅
```

### Step 5: Check Error Details

I've improved error handling. Now the frontend will show:
- **Specific error messages** from the server
- **Connection errors** if backend is not running
- **Validation errors** if fields are invalid

## 🚀 Quick Fix Checklist

- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] No errors in browser console
- [ ] Network request shows status 201 (not 400/500)
- [ ] `backend/data/` folder exists
- [ ] `backend/data/students.json` file exists

## 📝 Test Registration

1. Go to http://localhost:3000
2. Login as Institution
3. Click "Register Student"
4. Fill form:
   - **Name**: Test Student
   - **PRN**: PRN123 (must be unique)
   - **Email**: test@test.com
   - **Department**: CSE
   - **Year**: 2024
5. Click Submit

**Should see:** "Student registered successfully!" ✅

## 🔧 If Still Not Working

**Check backend console** for error messages when you submit the form.

**Common issues:**
1. **Port conflict**: Another process using port 5001
   - Fix: `netstat -ano | findstr :5001` then `taskkill /PID <PID> /F`

2. **CORS error**: Frontend can't reach backend
   - Fix: Check `FRONTEND_URL` in `backend/.env`

3. **Validation error**: Missing required fields
   - Fix: Make sure all fields are filled

4. **PRN already exists**: Duplicate PRN
   - Fix: Use a different PRN

## ✅ Everything Should Work Now!

The backend is confirmed working. The improved error messages will help identify any remaining issues!

