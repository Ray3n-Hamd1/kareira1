const { execSync } = require('child_process');

console.log('Installing frontend dependencies...');

try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('\nFrontend dependencies installed successfully!');
  console.log('\nYou can now run "npm start" to start the development server.');
} catch (error) {
  console.error('\nError installing dependencies:', error.message);
  process.exit(1);
}
