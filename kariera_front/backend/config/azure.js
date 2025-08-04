const { OpenAI } = require('openai');
require('dotenv').config();

// Configure OpenAI client with Azure credentials
const client = new OpenAI({
  apiKey: process.env.AZURE_EMBEDDING_API_KEY,
  baseURL: `${process.env.AZURE_EMBEDDING_ENDPOINT}openai/deployments/${process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.AZURE_EMBEDDING_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_EMBEDDING_API_KEY }
});

module.exports = { client };
