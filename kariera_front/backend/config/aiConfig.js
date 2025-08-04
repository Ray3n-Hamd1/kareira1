const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

dotenv.config();

// API Keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '60d532c4-35a5-4ca1-8316-1ff1aba2b6a5';
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || 'gcp-starter'; // Add this line
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCTGDo0PTvddLf3u5AZxN8OOsBJxLEuMMo';
const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || 'openai';
const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'kariera-jobs';

// Initialize AI clients
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  environment: PINECONE_ENVIRONMENT  // This was missing before
});

// Get models
const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0,
    responseType: 'json',
  }
});

module.exports = {
  openai,
  geminiModel,
  pinecone,
  INDEX_NAME,
  EMBEDDING_PROVIDER
};
