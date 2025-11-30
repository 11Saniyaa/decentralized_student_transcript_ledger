// Helper script to set up MongoDB connection string
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MongoDB Connection String Setup\n');
console.log('Your MongoDB Atlas details:');
console.log('  Username: 11saniyajadhav_db_user');
console.log('  Cluster: cluster0.vkrdlcg.mongodb.net');
console.log('  Database: transcript-ledger\n');

rl.question('Enter your MongoDB Atlas password: ', (password) => {
  if (!password || password.trim() === '') {
    console.error('\n❌ Password cannot be empty!');
    rl.close();
    process.exit(1);
  }

  // URL encode the password (in case it has special characters)
  const encodedPassword = encodeURIComponent(password.trim());
  
  // Create the connection string
  const mongoUri = `mongodb+srv://11saniyajadhav_db_user:${encodedPassword}@cluster0.vkrdlcg.mongodb.net/transcript-ledger?retryWrites=true&w=majority`;
  
  console.log('\n✅ Generated MongoDB connection string:');
  console.log(`MONGO_URI=${mongoUri.replace(/:[^:@]+@/, ':****@')}\n`); // Hide password in output
  
  // Update .env file
  const envPath = path.join(__dirname, '.env');
  
  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    } else {
      // Create from example
      const examplePath = path.join(__dirname, 'env.example');
      if (fs.existsSync(examplePath)) {
        envContent = fs.readFileSync(examplePath, 'utf8');
      }
    }
    
    // Replace or add MONGO_URI
    if (envContent.includes('MONGO_URI=')) {
      envContent = envContent.replace(/MONGO_URI=.*/g, `MONGO_URI=${mongoUri}`);
    } else {
      envContent += `\nMONGO_URI=${mongoUri}\n`;
    }
    
    // Also ensure other required vars are set
    if (!envContent.includes('PINATA_API_KEY=')) {
      envContent += `PINATA_API_KEY=82795f347901f115c351\n`;
    }
    if (!envContent.includes('PINATA_SECRET_API_KEY=')) {
      envContent += `PINATA_SECRET_API_KEY=89860b54f4210d4f3e5cb399ac5f64462724305785fefb5ba7dcaa5ad5e10adb\n`;
    }
    if (!envContent.includes('PORT=')) {
      envContent += `PORT=5001\n`;
    }
    if (!envContent.includes('NODE_ENV=')) {
      envContent += `NODE_ENV=development\n`;
    }
    if (!envContent.includes('FRONTEND_URL=')) {
      envContent += `FRONTEND_URL=http://localhost:3000\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ .env file updated successfully!');
    console.log('\n🧪 Testing connection...\n');
    
    // Test the connection
    const mongoose = require('mongoose');
    mongoose.connect(mongoUri)
      .then(() => {
        console.log('✅✅✅ MongoDB connection successful! ✅✅✅\n');
        console.log('🚀 You can now start the backend:');
        console.log('   npm run dev\n');
        mongoose.disconnect();
        rl.close();
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Connection test failed:', error.message);
        if (error.message.includes('authentication failed')) {
          console.error('\n⚠️  Authentication failed!');
          console.error('   - Double-check your password');
          console.error('   - Make sure the user has correct permissions in MongoDB Atlas');
        }
        rl.close();
        process.exit(1);
      });
  } catch (error) {
    console.error('❌ Error updating .env:', error.message);
    rl.close();
    process.exit(1);
  }
});

