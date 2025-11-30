const express = require("express");
const router = express.Router();
const multer = require("multer");

// Use file storage if MongoDB not configured, otherwise use MongoDB
const USE_FILE_STORAGE = process.env.USE_FILE_STORAGE === 'true' || !process.env.MONGO_URI || process.env.MONGO_URI.includes('<db_password>');
const Transcript = USE_FILE_STORAGE ? require("../models/TranscriptFile") : require("../models/Transcript");
const Student = USE_FILE_STORAGE ? require("../models/StudentFile") : require("../models/Student");
const { uploadToIPFS } = require("../utils/ipfs");
// Note: Backend does NOT sign transactions - only frontend MetaMask should sign

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as a buffer
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload transcript
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { studentPRN, docName, gpa, degree, semester, uploaderInstitution } = req.body;

    if (!studentPRN || !docName) {
      return res.status(400).json({ error: "Missing required fields: studentPRN and docName" });
    }

    // Get student info
    const student = await Student.findOne({ studentPRN });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // Convert to object if needed (for file storage)
    const studentObj = student.toObject ? student.toObject() : student;

    // Upload to IPFS via Pinata
    console.log(`📤 Uploading transcript "${docName}" to Pinata IPFS...`);
    const ipfsResult = await uploadToIPFS(req.file.buffer, req.file.originalname);
    console.log(`✅ Transcript uploaded to Pinata! CID: ${ipfsResult.cid}`);

    // Get transaction hash from request (MUST come from frontend MetaMask)
    // Backend will NOT sign transactions - only frontend MetaMask should sign
    let txHash = req.body.txHash || "";
    let blockNumber = parseInt(req.body.blockNumber) || 0;
    
    if (txHash) {
      console.log(`✅ Using MetaMask transaction hash from frontend: ${txHash}`);
    } else {
      console.log("ℹ️  No transaction hash provided. Transcript uploaded to IPFS but not recorded on-chain.");
      console.log("   To generate hash: Connect MetaMask and upload transcript again.");
    }

    // Save to database (MongoDB or file storage)
    const transcript = new Transcript({
      studentPRN,
      studentName: studentObj.studentName || student.studentName,
      docName,
      ipfsCid: ipfsResult.cid,
      ipfsUrl: ipfsResult.ipfsUrl,
      uploaderInstitution: uploaderInstitution || "Institution",
      metadata: {
        gpa: gpa || "",
        degree: degree || "",
        semester: semester || "",
      },
      txHash,
      blockNumber,
    });

    const saved = await transcript.save();

    res.status(201).json({
      message: "Transcript uploaded successfully",
      transcript: saved.toObject ? saved.toObject() : saved,
    });
  } catch (error) {
    console.error("Error uploading transcript:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update transcript (for adding transaction hash)
router.put("/:id", async (req, res) => {
  try {
    const { txHash, blockNumber } = req.body;
    
    // Find transcript
    let transcript;
    if (USE_FILE_STORAGE && Transcript.findById) {
      transcript = await Transcript.findById(req.params.id);
    } else {
      const transcripts = await Transcript.find();
      transcript = transcripts.find(t => t._id === req.params.id);
    }
    
    if (!transcript) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    // Update transaction hash
    if (txHash) transcript.txHash = txHash;
    if (blockNumber !== undefined) transcript.blockNumber = blockNumber;
    
    // Save updated transcript
    const saved = await transcript.save();
    
    res.json({
      message: "Transcript updated successfully",
      transcript: saved.toObject ? saved.toObject() : saved,
    });
  } catch (error) {
    console.error("Error updating transcript:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all transcripts
router.get("/", async (req, res) => {
  try {
    const transcripts = await Transcript.find();
    // File storage already returns sorted, MongoDB needs .sort()
    const sorted = USE_FILE_STORAGE ? transcripts : transcripts.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transcripts by PRN
router.get("/:prn", async (req, res) => {
  try {
    const transcripts = await Transcript.find({ studentPRN: req.params.prn });
    // File storage already returns sorted
    const sorted = USE_FILE_STORAGE ? transcripts : transcripts.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
