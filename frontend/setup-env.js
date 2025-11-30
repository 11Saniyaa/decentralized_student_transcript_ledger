// Script to create .env file for frontend
const fs = require('fs');
const path = require('path');

const envContent = `NEXT_PUBLIC_API_URL=http://localhost:5001
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created frontend/.env file!');
  console.log('   NEXT_PUBLIC_API_URL=http://localhost:5001');
  console.log('\n⚠️  IMPORTANT: Restart the frontend server!');
  console.log('   1. Stop frontend (Ctrl+C)');
  console.log('   2. Start again: npm run dev');
} catch (error) {
  console.error('❌ Error creating .env:', error.message);
  process.exit(1);
}

