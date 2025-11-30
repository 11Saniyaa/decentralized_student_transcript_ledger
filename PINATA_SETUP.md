# 📌 Pinata IPFS Setup for Transcripts

## ✅ Pinata is Now Required!

Transcripts **must** be uploaded to Pinata IPFS. The system will no longer use local file storage for transcripts.

## 🔑 How to Get Pinata API Keys

### Step 1: Sign Up for Pinata
1. Go to: https://app.pinata.cloud/
2. **Sign up** for a free account (or log in if you have one)

### Step 2: Create API Keys
1. Go to: **API Keys** section in your Pinata dashboard
2. Click: **"New Key"** or **"Create API Key"**
3. Give it a name (e.g., "Transcript Ledger")
4. **Copy** the following:
   - **API Key** (starts with something like `82795f347901f115c351`)
   - **Secret API Key** (long string like `89860b54f4210d4f3e5cb399ac5f64462724305785fefb5ba7dcaa5ad5e10adb`)

### Step 3: Add to Backend .env

**Open:** `backend/.env`

**Add or update:**
```env
PINATA_API_KEY=your_api_key_here
PINATA_SECRET_API_KEY=your_secret_api_key_here
```

**Example:**
```env
PINATA_API_KEY=82795f347901f115c351
PINATA_SECRET_API_KEY=89860b54f4210d4f3e5cb399ac5f64462724305785fefb5ba7dcaa5ad5e10adb
```

### Step 4: Restart Backend

After adding Pinata credentials:
```bash
cd backend
# Stop the server (Ctrl+C)
npm run dev
```

## ✅ Verify Pinata is Working

### Test Upload:
1. Go to: Institution Dashboard
2. Create a transcript
3. Upload a PDF
4. **Check backend console** - should see:
   ```
   📤 Uploading to Pinata IPFS...
   ✅ Successfully uploaded to Pinata IPFS! CID: Qm...
   ```

### If You See Errors:

**Error: "Pinata API credentials not configured"**
- Check `backend/.env` has `PINATA_API_KEY` and `PINATA_SECRET_API_KEY`
- Restart backend after adding keys

**Error: "Pinata authentication failed"**
- Check your API keys are correct
- Make sure you copied the full keys (no spaces)

**Error: "Pinata access denied"**
- Check your API keys have correct permissions
- Try creating a new API key in Pinata dashboard

## 🌐 IPFS Gateway URLs

After upload, transcripts are accessible via:
- **Pinata Gateway:** `https://gateway.pinata.cloud/ipfs/{CID}` (Primary - most reliable)
- **IPFS Public Gateway:** `https://ipfs.io/ipfs/{CID}`
- **DWeb Link:** `https://{CID}.ipfs.dweb.link/`

## 📝 Notes

- ✅ **Pinata is FREE** for reasonable usage
- ✅ **Files are permanently stored** on IPFS
- ✅ **Accessible worldwide** via IPFS gateways
- ✅ **No local storage needed** for PDFs

## 🎯 Summary

1. Get Pinata API keys from https://app.pinata.cloud/
2. Add to `backend/.env`
3. Restart backend
4. Upload transcripts - they'll go to Pinata IPFS! ✅

