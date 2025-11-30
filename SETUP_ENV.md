# ✅ Environment Setup Complete!

## 📝 Important: Replace Password in .env

Your `.env` file has been created, but you need to **replace `<db_password>`** with your actual MongoDB Atlas password.

### Edit `backend/.env`:

```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:YOUR_ACTUAL_PASSWORD@cluster0.vkrdlcg.mongodb.net/transcript-ledger?retryWrites=true&w=majority
```

**Replace `YOUR_ACTUAL_PASSWORD` with your MongoDB Atlas database password!**

## ✅ What's Configured

- ✅ MongoDB Atlas connection string (needs password)
- ✅ Pinata API keys
- ✅ Server port: 5001 (to avoid conflicts)
- ✅ Frontend URL for CORS

## 🚀 Next Steps

### 1. Update MongoDB Password

Edit `backend/.env` and replace `<db_password>` with your actual password.

### 2. Kill Any Processes on Port 5000/5001

```powershell
# Check what's using the ports
netstat -ano | findstr :5000
netstat -ano | findstr :5001

# Kill if needed (replace PID)
taskkill /PID <PID> /F
```

### 3. Start Backend

```bash
cd backend
npm run dev
```

Should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5001
```

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

### 5. Test Registration

1. Go to http://localhost:3000
2. Login as Institution
3. Register Student
4. Should work now! ✅

## 🔍 If Still Getting Errors

### MongoDB Authentication Error
- Check password in `.env` is correct
- Make sure MongoDB Atlas user has read/write permissions
- Verify network access in MongoDB Atlas (IP whitelist)

### Port Already in Use
- Kill the process: `taskkill /PID <PID> /F`
- Or change PORT in `.env` to a different number

### Syntax Errors
- Make sure all files are saved
- Restart nodemon/server

## ✅ All Set!

Once you update the password in `.env`, everything should work perfectly!

