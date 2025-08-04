const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting installation for Kariera backend dependencies...');

// Get the full package.json path
const packageJsonPath = path.join(__dirname, 'package.json');

// Verify package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: package.json not found!');
  process.exit(1);
}

try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('Successfully installed all dependencies!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}
