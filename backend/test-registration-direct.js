// Direct test of registration endpoint
const http = require('http');

const testData = {
  studentName: "Direct Test",
  studentPRN: "PRN_DIRECT_" + Date.now(),
  email: "direct@test.com",
  department: "CSE",
  year: "2024"
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/students',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing registration endpoint...');
console.log('Data:', testData);
console.log('\n📤 Sending POST request...\n');

const req = http.request(options, (res) => {
  let data = '';

  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n📥 Response:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      if (res.statusCode === 201) {
        console.log('\n✅✅✅ Registration works! ✅✅✅\n');
      } else {
        console.log('\n❌ Registration failed with status:', res.statusCode);
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.error('\n⚠️  Cannot connect to server!');
    console.error('   Make sure backend is running: cd backend && npm run dev');
  }
  process.exit(1);
});

req.write(postData);
req.end();

