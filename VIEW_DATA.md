# 📁 Where is Your Data Stored?

## ✅ Your Data is SAFE and PERSISTENT!

**Your data will NOT disappear** when you close and reopen the project!

## 📍 Location

**Full Path:**
```
C:\Users\Hp\Desktop\new_block\backend\data\
```

**Files:**
- `students.json` - All registered students
- `transcripts.json` - All uploaded transcripts

## 👀 How to View Your Data

### Method 1: Open in VS Code (Easiest)

1. Open your project in VS Code
2. In the left sidebar, navigate to:
   ```
   backend → data → students.json
   backend → data → transcripts.json
   ```
3. Click on the file to view it
4. VS Code will format the JSON nicely

### Method 2: Open in File Explorer

1. Open File Explorer
2. Navigate to: `C:\Users\Hp\Desktop\new_block\backend\data`
3. Double-click `students.json` or `transcripts.json`
4. It will open in your default text editor

### Method 3: View in Terminal

**PowerShell:**
```powershell
cd C:\Users\Hp\Desktop\new_block\backend\data
Get-Content students.json
Get-Content transcripts.json
```

**Command Prompt:**
```cmd
cd C:\Users\Hp\Desktop\new_block\backend\data
type students.json
type transcripts.json
```

## 📊 What's in Each File

### students.json
Contains all registered students:
```json
[
  {
    "_id": "1234567890",
    "studentName": "John Doe",
    "studentPRN": "22420303",
    "email": "john@example.com",
    "department": "Computer Science",
    "year": "2024",
    "dob": "2000-01-01"
  }
]
```

### transcripts.json
Contains all uploaded transcripts:
```json
[
  {
    "_id": "1234567891",
    "studentPRN": "22420303",
    "studentName": "John Doe",
    "docName": "Semester 1 Marksheet",
    "ipfsCid": "QmSeQCXCfqmd5dkWjU1UvouwfSofywF4mKTcGg8QGKD8EP",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/...",
    "txHash": "0x...",  ← Transaction hash (if verified on blockchain)
    "blockNumber": 123,
    "uploadDate": "2024-01-15T10:30:00.000Z"
  }
]
```

## ✅ Data Persistence

**YES! Your data is saved permanently!**

- ✅ Stored on your hard drive (not in memory)
- ✅ Persists after closing the project
- ✅ Persists after restarting your computer
- ✅ Saved immediately when you create/update records
- ✅ Can be backed up by copying the `data` folder

## 🔒 Backup Your Data

**To backup:**
1. Copy the `backend/data` folder
2. Save it somewhere safe (e.g., Desktop, USB drive)

**PowerShell:**
```powershell
Copy-Item -Path "C:\Users\Hp\Desktop\new_block\backend\data" -Destination "C:\Users\Hp\Desktop\data_backup" -Recurse
```

## ⚠️ Important Notes

1. **Don't delete** the `backend/data` folder - that's all your data!
2. **Don't edit** JSON files while the server is running
3. **Backup regularly** if you have important data
4. **JSON format** must be valid - don't break the syntax

## 🆘 Troubleshooting

**"I can't find my data!"**
- Check: `C:\Users\Hp\Desktop\new_block\backend\data`
- Make sure the folder exists
- Check if files are there

**"Data disappeared!"**
- Check if you accidentally deleted the `data` folder
- Check if files are empty (should have `[]` at minimum)
- Restore from backup if you have one

**"Can't open JSON file"**
- Use VS Code or any text editor
- Make sure file isn't corrupted
- Check file permissions

## 📈 Quick Check

**See how many records you have:**

**Students:**
```powershell
cd C:\Users\Hp\Desktop\new_block\backend\data
$students = Get-Content students.json | ConvertFrom-Json
Write-Host "Total Students: $($students.Count)"
```

**Transcripts:**
```powershell
$transcripts = Get-Content transcripts.json | ConvertFrom-Json
Write-Host "Total Transcripts: $($transcripts.Count)"
```

## ✅ Summary

| Question | Answer |
|----------|--------|
| **Where is data?** | `backend/data/students.json` and `transcripts.json` |
| **Will it disappear?** | ❌ **NO** - Saved permanently on disk |
| **Can I view it?** | ✅ **YES** - Open in VS Code or any text editor |
| **Is it safe?** | ✅ **YES** - On your local computer |
| **Can I backup?** | ✅ **YES** - Copy the `data` folder |

