// Script to help update MongoDB password in .env
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

console.log('🔐 MongoDB Password Update\n');
console.log('Your current .env has: <db_password> placeholder');
console.log('You need to replace it with your actual MongoDB Atlas password.\n');

rl.question('Enter your MongoDB Atlas password: ', (password) => {
  if (!password || password.trim() === '') {
    console.error('❌ Password cannot be empty!');
    rl.close();
    process.exit(1);
  }

  try {
    // Read current .env
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace <db_password> with actual password
    const updatedContent = envContent.replace(/<db_password>/g, password.trim());
    
    // Write back
    fs.writeFileSync(envPath, updatedContent);
    
    console.log('\n✅ Password updated in .env file!');
    console.log('✅ You can now restart the backend server.');
    console.log('\nTo test connection, run:');
    console.log('  node test-registration.js');
    
    rl.close();
  } catch (error) {
    console.error('❌ Error updating .env:', error.message);
    rl.close();
    process.exit(1);
  }
});

