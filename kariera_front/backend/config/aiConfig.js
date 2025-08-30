const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

dotenv.config();

// API Keys
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '60d532c4-35a5-4ca1-8316-1ff1aba2b6a5';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCTGDo0PTvddLf3u5AZxN8OOsBJxLEuMMo';
const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'kariera-jobs';

// Initialize AI clients
// Initialize AI clients
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const ai = new GoogleGenerativeAI({
  apiKey: GEMINI_API_KEY 
});
const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

// Get models
const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro',
  generationConfig: {
    temperature: 0,
  }
});

module.exports = {
  geminiModel,
  pinecone,
  INDEX_NAME,
  ai
};
