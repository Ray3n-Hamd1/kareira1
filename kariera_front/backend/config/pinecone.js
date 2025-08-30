const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

// Get Pinecone API key from environment variables
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '60d532c4-35a5-4ca1-8316-1ff1aba2b6a5';
const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'kariera-jobs';

// Initialize Pinecone client with proper configuration
const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

// Get the index
const index = pinecone.index(INDEX_NAME);

console.log(`Initialized Pinecone client with index: ${INDEX_NAME}`);

module.exports = { pinecone, index };
