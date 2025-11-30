# 💾 Data Persistence - How It Works

## ✅ Yes! Your Data is Saved Permanently

Your data is stored in **JSON files** in the `backend/data/` folder. This means:

### ✅ Data Persists When You:
- ✅ Restart the backend server
- ✅ Restart your computer
- ✅ Close and reopen the project
- ✅ Stop and start the application

### 📁 Where Data is Stored

- **Students:** `backend/data/students.json`
- **Transcripts:** `backend/data/transcripts.json`

These files are **permanent** - they stay on your computer until you delete them.

## 🔍 How to Verify

### Check Your Data Files:

1. **Open:** `backend/data/students.json`
   - You'll see all registered students
   - Data is in JSON format

2. **Open:** `backend/data/transcripts.json`
   - You'll see all uploaded transcripts
   - Data is in JSON format

### Test Persistence:

1. **Register a student** through the frontend
2. **Check:** `backend/data/students.json` - you'll see the new student
3. **Stop the backend** (Ctrl+C)
4. **Start it again:** `npm run dev`
5. **Check:** The student is still there! ✅

## ⚠️ Important Notes

### Data is Safe If:
- ✅ You don't delete the `backend/data/` folder
- ✅ You don't delete the JSON files
- ✅ You don't format your hard drive

### Data Will Be Lost If:
- ❌ You delete `backend/data/students.json`
- ❌ You delete `backend/data/transcripts.json`
- ❌ You delete the entire `backend/data/` folder

## 💡 Backup Your Data

### Option 1: Manual Backup
- Copy `backend/data/` folder to a safe location
- Copy it back if needed

### Option 2: Git (Recommended)
- The data files are in `.gitignore` (not tracked by git)
- This is good - you don't want to commit test data
- But you can manually copy them for backup

## 🔄 How It Works

1. **When you register a student:**
   - Data is saved to `backend/data/students.json`
   - File is updated immediately

2. **When you upload a transcript:**
   - Data is saved to `backend/data/transcripts.json`
   - File is updated immediately

3. **When you restart:**
   - Server reads from the JSON files
   - All your data is loaded back

## ✅ Summary

**Your data is permanent!** It's stored in files on your computer, so it persists across restarts. Just don't delete the `backend/data/` folder!

