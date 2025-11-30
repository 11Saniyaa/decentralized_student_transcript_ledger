// Test the API endpoint directly
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testRegistration() {
  try {
    console.log('🧪 Testing Student Registration API...\n');
    
    const testStudent = {
      studentName: "API Test Student",
      studentPRN: "PRN_API_" + Date.now(),
      email: "apitest@example.edu",
      department: "CSE",
      year: "2024",
      dob: "2000-01-01"
    };
    
    console.log('📤 Sending POST request to /api/students...');
    console.log('Data:', testStudent);
    
    const response = await axios.post(`${API_URL}/students`, testStudent);
    
    console.log('\n✅ Success!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Verify it was saved
    console.log('\n📥 Verifying student was saved...');
    const getResponse = await axios.get(`${API_URL}/students/${testStudent.studentPRN}`);
    console.log('✅ Student found:', getResponse.data);
    
    console.log('\n✅✅✅ Registration API is working! ✅✅✅\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Is the server running on port 5001?');
    }
    process.exit(1);
  }
}

testRegistration();

