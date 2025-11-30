// Complete fix and test script
const mongoose = require("mongoose");
const Student = require("./models/Student");
require("dotenv").config();

async function testConnection() {
  console.log('🧪 Testing MongoDB Connection...\n');
  
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGO_URI not found in .env file!');
    process.exit(1);
  }
  
  if (mongoUri.includes('<db_password>')) {
    console.error('❌ Password not set!');
    console.error('   Your .env file still has <db_password> placeholder.');
    console.error('\n   Run: node update-password.js');
    console.error('   Or manually edit backend/.env and replace <db_password> with your password');
    process.exit(1);
  }
  
  console.log('📝 Connection string:', mongoUri.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  try {
    console.log('\n⏳ Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!\n');
    
    // Test creating a student
    console.log('🧪 Testing student registration...');
    const testStudent = {
      studentName: "Test Student",
      studentPRN: "PRN_TEST_" + Date.now(),
      email: "test@example.edu",
      department: "CSE",
      year: "2024",
    };
    
    const student = new Student(testStudent);
    await student.save();
    console.log('✅ Student created successfully!');
    console.log('   Student:', student.studentName, '-', student.studentPRN);
    
    // Verify it was saved
    const found = await Student.findOne({ studentPRN: testStudent.studentPRN });
    if (found) {
      console.log('✅ Student found in database - Registration works!');
    }
    
    // Clean up
    await Student.deleteOne({ studentPRN: testStudent.studentPRN });
    console.log('🧹 Test data cleaned up\n');
    
    console.log('✅✅✅ Everything works! Registration is ready! ✅✅✅\n');
    console.log('🚀 Start your backend: npm run dev');
    console.log('🚀 Start your frontend: cd ../frontend && npm run dev');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes("authentication failed") || error.message.includes("bad auth")) {
      console.error('\n⚠️  Authentication Failed!');
      console.error('   - Check your password in backend/.env');
      console.error('   - Make sure you replaced <db_password> with your actual password');
      console.error('   - Verify MongoDB Atlas user has correct permissions');
      console.error('\n   Run: node update-password.js');
    } else if (error.message.includes("ECONNREFUSED")) {
      console.error('\n⚠️  Connection Refused!');
      console.error('   - Check your MongoDB Atlas connection string');
      console.error('   - Verify network access in MongoDB Atlas');
    } else {
      console.error('\n⚠️  Unexpected error:', error);
    }
    
    process.exit(1);
  }
}

testConnection();

