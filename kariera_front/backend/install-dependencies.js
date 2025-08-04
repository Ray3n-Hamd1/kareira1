const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing required dependencies for Kariera backend...');

// Define all required dependencies
const dependencies = {
  main: [
    'express',
    'cors',
    'morgan',
    'mongoose',
    'dotenv',
    'node-cron',
    'multer',
    'jsonwebtoken',
    'bcryptjs',
    'csv-parser',
    'csv-writer',
    'pdfkit',
  ],
  ai: [
    '@google/generative-ai',
    '@pinecone-database/pinecone',
    'openai',
    'langchain',
  ],
  azure: [
    '@azure/openai'
  ],
  dev: [
    'nodemon'
  ]
};

try {
  // Install main dependencies
  console.log('\nInstalling main dependencies...');
  execSync(`npm install ${dependencies.main.join(' ')}`, { stdio: 'inherit' });
  
  // Install AI dependencies
  console.log('\nInstalling AI-related dependencies...');
  execSync(`npm install ${dependencies.ai.join(' ')}`, { stdio: 'inherit' });
  
  // Install Azure dependencies
  console.log('\nInstalling Azure dependencies...');
  execSync(`npm install ${dependencies.azure.join(' ')}`, { stdio: 'inherit' });
  
  // Install dev dependencies
  console.log('\nInstalling development dependencies...');
  execSync(`npm install --save-dev ${dependencies.dev.join(' ')}`, { stdio: 'inherit' });
  
  console.log('\nAll dependencies installed successfully!');
} catch (error) {
  console.error('\nError installing dependencies:', error.message);
  process.exit(1);
}
