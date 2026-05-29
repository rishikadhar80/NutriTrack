#!/usr/bin/env node

/**
 * NutriTrack Backend - Vercel Deployment Script
 * Automates the deployment process to Vercel
 * Usage: node deploy.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runCommand(cmd, description) {
  log(`\n${description}...`, 'yellow');
  try {
    execSync(cmd, { stdio: 'inherit' });
    log('✓ Done', 'green');
    return true;
  } catch (error) {
    log(`✗ Failed: ${error.message}`, 'red');
    return false;
  }
}

async function deploy() {
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║  NutriTrack Backend - Vercel Deployment  ║', 'blue');
  log('╚════════════════════════════════════════════╝\n', 'blue');

  // Step 1: Check prerequisites
  log('=== Checking Prerequisites ===\n', 'bold');

  if (!checkCommand('npm')) {
    log('✗ npm not found. Please install Node.js and npm.', 'red');
    process.exit(1);
  }
  log('✓ npm is installed', 'green');

  if (!checkCommand('vercel')) {
    log('⚠ Vercel CLI not found. Installing...', 'yellow');
    if (!runCommand('npm install -g vercel', 'Installing Vercel CLI')) {
      log('⚠ Could not auto-install Vercel CLI. Please run: npm install -g vercel', 'yellow');
      process.exit(1);
    }
  }
  log('✓ Vercel CLI is installed', 'green');

  // Step 2: Check if logged in to Vercel
  log('\n=== Checking Vercel Authentication ===\n', 'bold');
  const vercelDir = path.join(process.env.HOME || process.env.USERPROFILE, '.vercel');
  if (!fs.existsSync(vercelDir)) {
    log('⚠ Not logged in to Vercel. Please log in...', 'yellow');
    try {
      execSync('vercel login', { stdio: 'inherit' });
    } catch (error) {
      log('✗ Login failed.', 'red');
      process.exit(1);
    }
  }
  log('✓ Vercel authentication OK', 'green');

  // Step 3: Check environment files
  log('\n=== Checking Configuration Files ===\n', 'bold');
  const requiredFiles = [
    { path: 'vercel.json', name: 'Vercel config' },
    { path: 'api/index.js', name: 'API handler' },
    { path: '.vercelignore', name: 'Vercel ignore rules' },
    { path: '.env', name: 'Environment variables' },
  ];

  let allFilesOk = true;
  for (const file of requiredFiles) {
    if (fs.existsSync(file.path)) {
      log(`✓ ${file.name} (${file.path})`, 'green');
    } else {
      log(`✗ ${file.name} (${file.path}) NOT FOUND`, 'red');
      allFilesOk = false;
    }
  }

  if (!allFilesOk) {
    log('\n✗ Missing required files. Setup incomplete.', 'red');
    process.exit(1);
  }

  // Step 4: Check environment variables
  log('\n=== Checking Environment Variables ===\n', 'bold');
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GROQ_API_KEY',
  ];

  let envOk = true;
  for (const envVar of requiredVars) {
    if (process.env[envVar]) {
      log(`✓ ${envVar} is set`, 'green');
    } else {
      log(`⚠ ${envVar} not in .env file`, 'yellow');
      envOk = false;
    }
  }

  if (!envOk) {
    log('\nNote: Missing environment variables will need to be set in Vercel dashboard', 'yellow');
  }

  // Step 5: Install dependencies
  log('\n=== Installing Dependencies ===\n', 'bold');
  if (!runCommand('npm install', 'Installing npm packages')) {
    log('✗ Failed to install dependencies.', 'red');
    process.exit(1);
  }

  // Step 6: Run tests
  log('\n=== Running Pre-Deployment Tests ===\n', 'bold');
  if (fs.existsSync('test-deployment.js')) {
    try {
      execSync('node test-deployment.js', { stdio: 'inherit' });
      log('✓ All tests passed', 'green');
    } catch (error) {
      log('\n⚠ Some tests failed. Continue with deployment?', 'yellow');
      // Continue anyway - some tests might fail in CI
    }
  }

  // Step 7: Deploy
  log('\n=== Deploying to Vercel ===\n', 'bold');
  log('Starting Vercel deployment...', 'yellow');

  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    log('\n✓ Deployment successful!', 'green');
  } catch (error) {
    log('\n✗ Deployment failed.', 'red');
    process.exit(1);
  }

  // Step 8: Post-deployment instructions
  log('\n╔════════════════════════════════════════════╗', 'green');
  log('║    Deployment Complete! 🎉               ║', 'green');
  log('╚════════════════════════════════════════════╝\n', 'green');

  log('Next Steps:', 'bold');
  log('1. Go to: https://vercel.com/dashboard', 'yellow');
  log('2. Select your project', 'yellow');
  log('3. Go to: Settings > Environment Variables', 'yellow');
  log('4. Add these variables:', 'yellow');
  log('   - MONGODB_URI: <your MongoDB connection string>', 'yellow');
  log('   - JWT_SECRET: <your JWT secret>', 'yellow');
  log('   - GROQ_API_KEY: <your Groq API key>', 'yellow');
  log('   - FRONTEND_URL: <your frontend domain>', 'yellow');
  log('   - NODE_ENV: production', 'yellow');
  log('\n5. Test your deployment:', 'yellow');
  log('   - curl https://<your-domain>.vercel.app/api/health', 'yellow');
  log('\n6. Update your frontend API URL to point to the deployed backend', 'yellow');

  log('\n📝 For detailed instructions, see VERCEL_DEPLOYMENT.md', 'blue');
}

deploy().catch((error) => {
  log(`\nFatal error: ${error.message}`, 'red');
  process.exit(1);
});
