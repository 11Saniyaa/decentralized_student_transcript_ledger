// Simple test script to verify student registration works
require("dotenv").config();

// Use file storage if MongoDB not configured
const USE_FILE_STORAGE = process.env.USE_FILE_STORAGE === 'true' || !process.env.MONGO_URI || process.env.MONGO_URI.includes('<db_password>');

let mongoose, Student;
if (USE_FILE_STORAGE) {
  Student = require("./models/StudentFile");
  console.log("📁 Using file-based storage");
} else {
  mongoose = require("mongoose");
  Student = require("./models/Student");
}

async function testRegistration() {
  try {
    // Connect to database (MongoDB or file storage)
    if (!USE_FILE_STORAGE) {
      const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/transcript-ledger";
      console.log("Connecting to MongoDB...");
      await mongoose.connect(mongoUri);
      console.log("✅ Connected to MongoDB");
    } else {
      console.log("📁 Using file-based storage (no MongoDB needed)");
    }

    // Test student data
    const testStudent = {
      studentName: "Test Student",
      studentPRN: "PRN_TEST_" + Date.now(),
      email: "test@example.edu",
      department: "CSE",
      year: "2024",
      dob: "2000-01-01",
    };

    console.log("\nCreating test student...");
    const student = new Student(testStudent);
    await student.save();
    console.log("✅ Student created successfully!");
    console.log("Student:", student);

    // Verify it was saved
    const found = await Student.findOne({ studentPRN: testStudent.studentPRN });
    if (found) {
      console.log("\n✅ Student found in database!");
      console.log("Verification successful!");
    } else {
      console.log("\n❌ Student not found in database!");
    }

    // Clean up test data
    if (USE_FILE_STORAGE) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, 'data/students.json');
      const students = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const filtered = students.filter(s => s.studentPRN !== testStudent.studentPRN);
      fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
    } else {
      await Student.deleteOne({ studentPRN: testStudent.studentPRN });
    }
    console.log("\n🧹 Test data cleaned up");

    if (!USE_FILE_STORAGE && mongoose) {
      await mongoose.disconnect();
    }
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.message.includes("ECONNREFUSED")) {
      console.error("\n⚠️  MongoDB is not running!");
      console.error("💡 Tip: Set USE_FILE_STORAGE=true in .env to use file storage instead!");
      console.error("Solutions:");
      console.error("1. Set USE_FILE_STORAGE=true in .env (easiest!)");
      console.error("2. Start MongoDB service");
      console.error("3. Use MongoDB Atlas (cloud) - update MONGO_URI in .env");
    }
    if (!USE_FILE_STORAGE && mongoose) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

testRegistration();

