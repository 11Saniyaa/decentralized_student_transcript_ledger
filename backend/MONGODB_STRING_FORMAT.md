# MongoDB Connection String Format

## ✅ Correct Format

Your MongoDB Atlas connection string should look like this:

```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:YOUR_PASSWORD@cluster0.vkrdlcg.mongodb.net/transcript-ledger?retryWrites=true&w=majority
```

## 🔧 How to Get Your Password

1. Go to https://cloud.mongodb.com/
2. Login to your account
3. Go to **Database Access** (left sidebar)
4. Find user: `11saniyajadhav_db_user`
5. Click **Edit** → **Show Password** or **Reset Password**
6. Copy the password

## ⚠️ Important Notes

- **Replace `YOUR_PASSWORD`** with your actual password
- If password has special characters, they will be URL-encoded automatically
- Make sure user has **Read and Write** permissions
- Make sure your IP is whitelisted in **Network Access** (or allow all IPs: 0.0.0.0/0)

## 🚀 Quick Setup

Run this script to set it up automatically:

```bash
cd backend
node setup-mongodb.js
```

Enter your password when prompted - it will:
- ✅ Generate correct connection string
- ✅ Update .env file
- ✅ Test the connection
- ✅ Show success/error messages

## 📝 Manual Setup

If you prefer to edit manually:

1. Open `backend/.env`
2. Find or add this line:
   ```env
   MONGO_URI=mongodb+srv://11saniyajadhav_db_user:YOUR_ACTUAL_PASSWORD@cluster0.vkrdlcg.mongodb.net/transcript-ledger?retryWrites=true&w=majority
   ```
3. Replace `YOUR_ACTUAL_PASSWORD` with your real password
4. Save the file

## 🧪 Test Connection

After setting up, test it:

```bash
cd backend
node fix-and-test.js
```

## ✅ Example (with fake password)

```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:MyPassword123@cluster0.vkrdlcg.mongodb.net/transcript-ledger?retryWrites=true&w=majority
```

**NOT:**
```env
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:<db_password>@cluster0...
```

