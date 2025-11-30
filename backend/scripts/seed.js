const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

// Use file storage if MongoDB not configured
const USE_FILE_STORAGE = process.env.USE_FILE_STORAGE === 'true' || !process.env.MONGO_URI || process.env.MONGO_URI.includes('<db_password>');

let mongoose, Student, Transcript;
if (USE_FILE_STORAGE) {
  Student = require("../models/StudentFile");
  Transcript = require("../models/TranscriptFile");
  console.log("📁 Using file-based storage for seed data");
} else {
  mongoose = require("mongoose");
  Student = require("../models/Student");
  Transcript = require("../models/Transcript");
}

const { uploadToIPFS } = require("../utils/ipfs");
const { issueTranscriptOnChain } = require("../utils/contract");

// Mock student data
const mockStudents = [
  {
    studentName: "Aarav Sharma",
    studentPRN: "PRN2024001",
    email: "aarav.sharma@example.edu",
    department: "CSE",
    year: "2024",
    dob: "2002-05-15",
  },
  {
    studentName: "Priya Patel",
    studentPRN: "PRN2024002",
    email: "priya.patel@example.edu",
    department: "ECE",
    year: "2024",
    dob: "2002-08-20",
  },
  {
    studentName: "Rohan Kumar",
    studentPRN: "PRN2024003",
    email: "rohan.kumar@example.edu",
    department: "ME",
    year: "2023",
    dob: "2001-12-10",
  },
  {
    studentName: "Ananya Singh",
    studentPRN: "PRN2024004",
    email: "ananya.singh@example.edu",
    department: "CSE",
    year: "2024",
    dob: "2002-03-25",
  },
  {
    studentName: "Vikram Reddy",
    studentPRN: "PRN2024005",
    email: "vikram.reddy@example.edu",
    department: "IT",
    year: "2023",
    dob: "2001-11-05",
  },
];

// Mock transcript data
const mockTranscripts = [
  {
    studentPRN: "PRN2024001",
    docName: "Transcript_Semester1_2024.pdf",
    gpa: "8.5",
    degree: "Bachelor of Technology",
    semester: "Semester 1",
  },
  {
    studentPRN: "PRN2024002",
    docName: "Transcript_Semester2_2024.pdf",
    gpa: "9.0",
    degree: "Bachelor of Technology",
    semester: "Semester 2",
  },
  {
    studentPRN: "PRN2024001",
    docName: "Transcript_Semester2_2024.pdf",
    gpa: "8.8",
    degree: "Bachelor of Technology",
    semester: "Semester 2",
  },
];

// Create a simple PDF buffer (minimal PDF structure)
function createMockPDF(content = "Sample Transcript Document") {
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(${content}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000314 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
398
%%EOF`;

  return Buffer.from(pdfContent);
}

async function seedDatabase() {
  try {
    // Connect to database (MongoDB or file storage)
    if (!USE_FILE_STORAGE) {
      const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/transcript-ledger";
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB");
    } else {
      console.log("Using file-based storage (no MongoDB connection needed)");
    }

    // Clear existing data (optional - comment out if you want to keep existing data)
    if (USE_FILE_STORAGE) {
      await Student.deleteMany({});
      await Transcript.deleteMany({});
    } else {
      await Student.deleteMany({});
      await Transcript.deleteMany({});
    }
    console.log("Cleared existing data");

    // Insert students
    console.log("Inserting students...");
    let insertedStudents;
    if (USE_FILE_STORAGE) {
      insertedStudents = [];
      for (const studentData of mockStudents) {
        const student = new Student(studentData);
        const saved = await student.save();
        insertedStudents.push(saved);
      }
    } else {
      insertedStudents = await Student.insertMany(mockStudents);
    }
    console.log(`Inserted ${insertedStudents.length} students`);

    // Upload transcripts to IPFS and create records
    console.log("Uploading transcripts to IPFS...");
    const transcriptsToInsert = [];

    for (const transcriptData of mockTranscripts) {
      const student = insertedStudents.find((s) => s.studentPRN === transcriptData.studentPRN);
      if (!student) {
        console.warn(`Student ${transcriptData.studentPRN} not found, skipping transcript`);
        continue;
      }

      // Create mock PDF
      const pdfBuffer = createMockPDF(
        `Transcript for ${student.studentName} - ${transcriptData.semester}`
      );

      try {
        // Upload to IPFS
        const ipfsResult = await uploadToIPFS(pdfBuffer, transcriptData.docName);
        console.log(`Uploaded ${transcriptData.docName} to IPFS: ${ipfsResult.cid}`);

        // Issue on-chain (optional - may fail if contract not deployed)
        let txHash = "";
        let blockNumber = 0;
        try {
          if (process.env.CONTRACT_ADDRESS) {
            const txResult = await issueTranscriptOnChain(
              transcriptData.studentPRN,
              ipfsResult.cid,
              transcriptData.docName
            );
            txHash = txResult.txHash;
            blockNumber = txResult.blockNumber;
            console.log(`Issued transcript on-chain: ${txHash}`);
          }
        } catch (error) {
          console.warn("On-chain transaction failed (this is okay for testing):", error.message);
        }

        // Create transcript record
        const transcript = {
          studentPRN: transcriptData.studentPRN,
          studentName: student.studentName,
          docName: transcriptData.docName,
          ipfsCid: ipfsResult.cid,
          ipfsUrl: ipfsResult.ipfsUrl,
          uploaderInstitution: "Institution",
          metadata: {
            gpa: transcriptData.gpa,
            degree: transcriptData.degree,
            semester: transcriptData.semester,
          },
          txHash,
          blockNumber,
        };

        transcriptsToInsert.push(transcript);
      } catch (error) {
        console.error(`Error processing transcript ${transcriptData.docName}:`, error.message);
      }
    }

    // Insert transcripts
    if (transcriptsToInsert.length > 0) {
      if (USE_FILE_STORAGE) {
        for (const transcriptData of transcriptsToInsert) {
          const transcript = new Transcript(transcriptData);
          await transcript.save();
        }
      } else {
        await Transcript.insertMany(transcriptsToInsert);
      }
      console.log(`Inserted ${transcriptsToInsert.length} transcripts`);
    }

    console.log("Seeding completed successfully!");
    if (!USE_FILE_STORAGE && mongoose) {
      await mongoose.disconnect();
    }
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    if (!USE_FILE_STORAGE && mongoose) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seedDatabase();
