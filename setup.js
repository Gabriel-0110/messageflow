#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up TwilioMessage App...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copying .env.example to .env.local...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Environment file created');
    console.log('⚠️  Please update .env.local with your Twilio credentials\n');
  }
}

// Install dependencies if node_modules doesn't exist
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
}

// Set up database
console.log('🗄️  Setting up database...');
try {
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });
  execSync('npx prisma db push', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Database configured\n');
} catch (error) {
  console.log('⚠️  Database setup had issues - you may need to configure manually\n');
}

// Success message
console.log('🎉 Setup complete!\n');
console.log('Next steps:');
console.log('1. Update .env.local with your Twilio credentials');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:3000\n');
console.log('📚 For help: https://github.com/your-repo/twilio-messaging-app\n');

// Display Twilio setup instructions
console.log('🔧 Twilio Setup Required:');
console.log('- Get Account SID and Auth Token from Twilio Console');
console.log('- Purchase a phone number with SMS/RCS capabilities');  
console.log('- Configure webhook URL: https://yourdomain.com/api/twilio/webhook');
console.log('- Apply for RCS access for rich messaging features\n');

console.log('Happy messaging! 📱✨');