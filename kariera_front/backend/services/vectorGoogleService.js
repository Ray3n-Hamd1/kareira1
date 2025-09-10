// embeddingService.js
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { index } = require('../config/pinecone'); // your Pinecone config
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { getSparseVector } = require('./sparseVectorService');
require('dotenv').config();
const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: 'text-embedding-004',
  apiKey: process.env.GEMINI_API_KEY,
});
/**
 * Generate an embedding from Google Gemini
 * @param {string} text
 * @param {number} outputDimensionality - Optional, 3072 (default), 1536, or 768
 * @returns {Promise<number[]>} The embedding vector
 */
async function generateEmbedding(text, outputDimensionality = 3072) {
  try {
    return await embeddings.embedQuery(text);
  } catch (error) {
    console.error('Error generating embedding (Gemini):', error);
    throw error;
  }
}

/**
 * Embed and store jobs in Pinecone
 * @param {Array<Object>} jobs
 * @returns {Promise<boolean>}
 */
async function embedAndStoreJobs(jobs) {
  try {
    // Clean null values
    const cleanedJobs = jobs.map(job => {
      const cleaned = {};
      for (const [key, value] of Object.entries(job)) {
        cleaned[key] = value === null ? '' : value;
      }
      return cleaned;
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 700,
      chunkOverlap: 70
    });

    const vectorsWithMetadata = [];

    console.log(`Splitting and embedding jobs...`);

    for (const job of cleanedJobs) {
      // Combine job fields into one string
      const combinedText = Object.values(job).join(' ');
      const chunks = await textSplitter.splitText(combinedText);
      const chunkEmbeddings = await embeddings.embedDocuments(chunks);

      chunks.forEach((chunk, i) => {
        vectorsWithMetadata.push({
          id: `${job.id}#${i}`, // unique per chunk
          values: chunkEmbeddings[i],
          metadata: {
            ...job,
            chunk_index: i,
            chunk_text: chunk
          }
        });
      });
      
    }

    console.log(`Generated ${vectorsWithMetadata.length} embeddings total.`);

    // Upsert in batches
    const upsertBatchSize = 100;
    for (let i = 0; i < vectorsWithMetadata.length; i += upsertBatchSize) {
      const batch = vectorsWithMetadata.slice(i, i + upsertBatchSize);
      await index.upsert(batch);
      console.log(`Upserted batch ${Math.floor(i / upsertBatchSize) + 1}`);
    }

    console.log(`Successfully embedded and stored all job vectors.`);
    return true;
  } catch (error) {
    console.error('Error in embedAndStoreJobs:', error);
    return false;
  }
}

/**
 * Search Pinecone for job matches based on query text
 * @param {string} query
 * @param {number} numberOfJobs
 * @returns {Promise<Object>}
 */
async function searchEmbeddings(query,skills, numberOfJobs = 4) {
  try {
    const denseEmbedding = await embeddings.embedQuery(query);
    // Sparse vector for resume skills
    //const sparseEmbedding = await getSparseVector(skills);

    // Hybrid search 
    const results = await index.query({
      vector: denseEmbedding,
      //sparseVector: sparseEmbedding,
      topK: numberOfJobs,
      includeValues: false,
      includeMetadata: true,
    });

    if (!results || !results.matches) {
      return { matches: [] };
    }

    return results;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

/**
 * Format search results into readable string
 * @param {Object} results
 * @returns {string}
 */
function formatSearchResults(results) {
  const formattedResults = [];

  for (const match of results.matches) {
    const md = match.metadata || {};
    let formatted = '';

    if (md.title) formatted += `Title: ${md.title}\n`;
    if (md.company) formatted += `Company: ${md.company}\n`;
    if (md.description) formatted += `${md.description}\n`;
    if (md.location) formatted += `Location: ${md.location}\n`;
    if (md.job_url) formatted += `Job URL: ${md.job_url}`;

    formattedResults.push(formatted);
  }

  return formattedResults.join('\n\n---\n\n');
}

module.exports = {
  generateEmbedding,
  embedAndStoreJobs,
  searchEmbeddings,
  formatSearchResults
};
