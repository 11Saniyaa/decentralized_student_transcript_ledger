const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔧 Contract Address Setup\n');
  console.log('This will help you set up CONTRACT_ADDRESS in backend/.env\n');
  
  const contractAddress = await question('Enter your contract address (or press Enter to skip): ');
  
  if (!contractAddress || !contractAddress.trim()) {
    console.log('\n⚠️  No address provided. Skipping setup.');
    console.log('\nTo set up manually:');
    console.log('1. Deploy contract: cd contract && npx hardhat run scripts/deploy-local.js --network localhost');
    console.log('2. Add CONTRACT_ADDRESS=0x... to backend/.env');
    rl.close();
    return;
  }

  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Check if CONTRACT_ADDRESS already exists
  if (envContent.includes('CONTRACT_ADDRESS=')) {
    // Update existing
    envContent = envContent.replace(/CONTRACT_ADDRESS=.*/g, `CONTRACT_ADDRESS=${contractAddress.trim()}`);
    console.log('\n✅ Updated existing CONTRACT_ADDRESS in .env');
  } else {
    // Add new
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `\n# Smart Contract Address\nCONTRACT_ADDRESS=${contractAddress.trim()}\n`;
    console.log('\n✅ Added CONTRACT_ADDRESS to .env');
  }

  // Write back to file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n📝 Contract address saved!');
  console.log('   Restart your backend server to apply changes.');
  console.log('   New transcript uploads will generate transaction hashes!\n');
  
  rl.close();
}

main().catch(console.error);

