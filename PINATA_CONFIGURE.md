# 🔧 Quick Pinata Configuration

## ✅ Your Pinata Credentials

Based on your previous setup, you had these credentials:
- **API Key:** `82795f347901f115c351`
- **Secret API Key:** `89860b54f4210d4f3e5cb399ac5f64462724305785fefb5ba7dcaa5ad5e10adb`

## 🚀 Quick Setup

### Option 1: Add to Existing .env

**Open:** `backend/.env`

**Add these lines:**
```env
PINATA_API_KEY=82795f347901f115c351
PINATA_SECRET_API_KEY=89860b54f4210d4f3e5cb399ac5f64462724305785fefb5ba7dcaa5ad5e10adb
```

### Option 2: Use Script

```bash
cd backend
node -e "const fs=require('fs'); const path='.env'; let content=fs.existsSync(path)?fs.readFileSync(path,'utf8'):''; if(!content.includes('PINATA_API_KEY=')){content+='\nPINATA_API_KEY=82795f347901f115c351\nPINATA_SECRET_API_KEY=89860b54f4210d4f3e5cb399ac5f64462724305785fefb5ba7dcaa5ad5e10adb\n'; fs.writeFileSync(path,content); console.log('✅ Added Pinata credentials');} else {console.log('✅ Pinata credentials already exist');}"
```

## ✅ Verify

**Check if configured:**
```bash
cd backend
node -e "require('dotenv').config(); console.log('PINATA_API_KEY:', process.env.PINATA_API_KEY ? '✅ Set' : '❌ Not set');"
```

## 🎯 After Configuration

1. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test upload:**
   - Go to Create Transcript
   - Upload a PDF
   - Should see: `✅ Successfully uploaded to Pinata IPFS!`

## 📝 Important

- ✅ Pinata is now **REQUIRED** for transcript uploads
- ✅ All transcripts will be stored on IPFS via Pinata
- ✅ Files are accessible worldwide via IPFS gateways
- ✅ No local file storage for PDFs

