# 📁 Data Storage Guide

## 🗂️ Where Your Data is Stored

All your data is stored in **JSON files** in the `backend/data/` directory:

```
backend/
  └── data/
      ├── students.json      ← All registered students
      └── transcripts.json   ← All uploaded transcripts
```

## ✅ Data Persistence

**YES! Your data will NOT disappear** when you close and reopen the project!

- ✅ Data is stored in **files on your computer** (not in memory)
- ✅ Data persists even after closing the project
- ✅ Data persists even after restarting your computer
- ✅ Data is saved immediately when you create/update records

## 📍 Exact Location

**Full Path:**
```
C:\Users\Hp\Desktop\new_block\backend\data\
```

**Files:**
- `students.json` - Contains all student registrations
- `transcripts.json` - Contains all transcript uploads

## 👀 How to View Your Data

### Option 1: View in Code Editor (Recommended)

1. Open your project in VS Code (or any editor)
2. Navigate to: `backend/data/`
3. Open `students.json` or `transcripts.json`
4. View/edit the JSON data directly

### Option 2: View in Terminal

**View Students:**
```bash
cd backend
cat data/students.json
```

**View Transcripts:**
```bash
cd backend
cat data/transcripts.json
```

**On Windows (PowerShell):**
```powershell
cd backend
Get-Content data/students.json
Get-Content data/transcripts.json
```

### Option 3: View in Browser (JSON Formatter)

1. Open `backend/data/students.json` in VS Code
2. Right-click → "Copy Path"
3. Paste in browser: `file:///C:/Users/Hp/Desktop/new_block/backend/data/students.json`
4. Browser will show formatted JSON

### Option 4: Use Online JSON Viewer

1. Copy contents of `students.json` or `transcripts.json`
2. Paste at: https://jsonviewer.stack.hu/
3. View formatted data

## 📊 Data Structure

### students.json
```json
[
  {
    "_id": "unique-id",
    "studentName": "John Doe",
    "studentPRN": "22420303",
    "email": "john@example.com",
    "department": "Computer Science",
    "year": "2024",
    "dob": "2000-01-01",
    "registrationDate": "2024-01-15T10:30:00.000Z"
  }
]
```

### transcripts.json
```json
[
  {
    "_id": "unique-id",
    "studentPRN": "22420303",
    "studentName": "John Doe",
    "docName": "Semester 1 Marksheet",
    "ipfsCid": "QmSeQCXCfqmd5dkWjU1UvouwfSofywF4mKTcGg8QGKD8EP",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmSeQCXCfqmd5dkWjU1UvouwfSofywF4mKTcGg8QGKD8EP",
    "uploadDate": "2024-01-15T10:30:00.000Z",
    "txHash": "0x...",  ← Transaction hash (if blockchain verified)
    "blockNumber": 123,  ← Block number (if blockchain verified)
    "metadata": {
      "gpa": "3.5",
      "degree": "B.Tech",
      "semester": "1"
    }
  }
]
```

## 🔒 Data Safety

### Backup Your Data

**Manual Backup:**
1. Copy `backend/data/` folder
2. Save it somewhere safe (e.g., `backend/data_backup/`)

**PowerShell Backup:**
```powershell
Copy-Item -Path "backend\data" -Destination "backend\data_backup_$(Get-Date -Format 'yyyyMMdd')" -Recurse
```

### Restore Data

If you need to restore:
1. Stop the backend server
2. Replace `backend/data/` with your backup
3. Restart the backend

## ⚠️ Important Notes

1. **Don't delete** `backend/data/` folder - that's where all your data is!
2. **Don't edit** JSON files while the server is running (may cause conflicts)
3. **Backup regularly** if you have important data
4. **File format** is JSON - must be valid JSON syntax

## 🔄 Data Migration

If you want to switch to MongoDB later:
1. Export data from JSON files
2. Import to MongoDB using migration script
3. Update `USE_FILE_STORAGE=false` in `.env`

## 📈 Current Data Status

Check your current data:
```powershell
cd backend
# Count students
(Get-Content data\students.json | ConvertFrom-Json).Count

# Count transcripts
(Get-Content data\transcripts.json | ConvertFrom-Json).Count
```

## 🆘 Troubleshooting

**"Data disappeared!"**
- Check `backend/data/` folder exists
- Check files are not empty
- Check you're looking in the right location

**"Can't see my data"**
- Make sure backend server is not running when viewing files
- Check file permissions
- Try opening in a different editor

**"JSON file is corrupted"**
- Restore from backup
- Check for syntax errors (missing commas, brackets)

## ✅ Summary

| Question | Answer |
|----------|--------|
| **Where is data stored?** | `backend/data/students.json` and `backend/data/transcripts.json` |
| **Will data disappear?** | ❌ NO - Data is saved to disk permanently |
| **Can I view it?** | ✅ YES - Open JSON files in any text editor |
| **Can I edit it?** | ⚠️ YES, but stop server first |
| **Is it safe?** | ✅ YES - It's on your local computer |

