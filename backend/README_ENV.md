# ⚠️ CRITICAL: Update MongoDB Password

## The Problem

Your `.env` file has this:
```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:<db_password>@cluster0.vkrdlcg.mongodb.net/...
```

The `<db_password>` is a **placeholder** - you MUST replace it with your actual MongoDB Atlas password!

## ✅ How to Fix

### Method 1: Edit .env File Directly

1. Open `backend/.env` in a text editor
2. Find the line with `MONGO_URI`
3. Replace `<db_password>` with your actual password
4. Save the file

**Example:**
If your password is `MyPassword123`, change:
```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:<db_password>@cluster0...
```

To:
```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:MyPassword123@cluster0.vkrdlcg.mongodb.net/transcript-ledger?retryWrites=true&w=majority
```

### Method 2: Use Helper Script

```bash
cd backend
node update-password.js
```

Enter your password when prompted.

## 🧪 Test After Updating

```bash
cd backend
node fix-and-test.js
```

This will test the connection and registration.

## ✅ After Password is Fixed

1. Restart backend: `npm run dev`
2. Should see: `✅ Connected to MongoDB`
3. Registration will work!

## 🔍 Where to Find Your Password

- MongoDB Atlas Dashboard → Database Access → Your user → Show password
- Or the password you set when creating the database user

