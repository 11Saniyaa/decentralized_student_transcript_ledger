// Script to create .env file with your credentials
const fs = require('fs');
const path = require('path');

const envContent = `# MongoDB Configuration
# IMPORTANT: Replace <db_password> with your actual MongoDB Atlas password!
MONGO_URI=mongodb+srv://11saniyajadhav_db_user:<Saniya,123>@cluster0.vkrdlcg.mongodb.net/

# Pinata IPFS Configuration
PINATA_API_KEY=82795f347901f115c351
PINATA_SECRET_API_KEY=89860b54f4210d4f3e5cb399ac5f64462724305785fefb5ba7dcaa5ad5e10adb

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('\n⚠️  IMPORTANT: Edit backend/.env and replace <db_password> with your actual MongoDB Atlas password!');
  console.log('   Example: mongodb+srv://11saniyajadhav_db_user:MyPassword123@cluster0.vkrdlcg.mongodb.net/...');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}

