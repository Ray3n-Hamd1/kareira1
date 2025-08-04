const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { client } = require('../config/azure');
const { index } = require('../config/pinecone');

// Generate embeddings using Azure OpenAI
async function generateEmbedding(text) {
    try {
        const response = await client.embeddings.create({
            input: text,
            model: "text-embedding-3-large"  // Using the model directly
        });

        if (!response || !response.data || !response.data[0]) {
            throw new Error('Invalid response from Azure OpenAI');
        }
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

// Embed and store jobs in Pinecone
const embedAndStoreJobs = async (jobs) => {
  try {
    // Replace any null values with empty strings
    const cleanedJobs = jobs.map(job => {
      const cleanedJob = {};
      for (const [key, value] of Object.entries(job)) {
        cleanedJob[key] = value === null ? '' : value;
      }
      return cleanedJob;
    });
    
    // Create combined text for each job
    const combinedTexts = cleanedJobs.map(job => {
      return Object.values(job).join(' ');
    });
    
    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 700,
      chunkOverlap: 70,
    });
    
    const texts = [];
    for (const text of combinedTexts) {
      const chunks = await textSplitter.splitText(text);
      texts.push(...chunks);
    }
    
    console.log(`Generating embeddings for ${texts.length} text chunks...`);
    
    // Process in batches to avoid rate limiting
    const batchSize = 20;
    const vectors = [];
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchEmbeddings = await Promise.all(batch.map(text => generateEmbedding(text)));
      vectors.push(...batchEmbeddings);
    }
    
    console.log(`Successfully generated ${vectors.length} embeddings`);

    // Prepare the IDs and metadata
    const ids = cleanedJobs.map(job => job.id);
    const jobMetadata = cleanedJobs;
    
    // Prepare vectors with IDs and metadata
    const vectors_with_metadata = [];
    
    // Assign each vector to a job
    ids.forEach((id, idx) => {
      if (idx < vectors.length) {
        vectors_with_metadata.push({
          id,
          values: vectors[idx],
          metadata: jobMetadata[idx]
        });
      }
    });
    
    // Upsert in batches to avoid hitting size limits
    const upsertBatchSize = 100;
    for (let i = 0; i < vectors_with_metadata.length; i += upsertBatchSize) {
      const batch = vectors_with_metadata.slice(i, i + upsertBatchSize);
      await index.upsert(batch);
    }
    
    console.log(`Successfully embedded and stored ${vectors_with_metadata.length} job vectors`);
    return true;
  } catch (error) {
    console.error('Error in embedAndStoreJobs:', error);
    return false;
  }
};

// Vector search for job matching
async function searchEmbeddings(query, numberOfJobs = 4) {
    try {
        const queryEmbedding = await generateEmbedding(query);
        
        const searchParams = {
            vector: queryEmbedding,
            topK: Number(numberOfJobs),
            includeValues: false,
            includeMetadata: true
        };

        const results = await index.query(searchParams);
        
        if (!results || !results.matches) {
            return { matches: [] };
        }

        return results;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
}

// Format search results for further processing
function formatSearchResults(results) {
    const formattedResults = [];
    
    for (const match of results.matches) {
        const description = match.metadata.description || '';
        const jobUrl = match.metadata.job_url || '';
        const jobLocation = match.metadata.location || '';
        const company = match.metadata.company || '';
        const title = match.metadata.title || '';
        
        let formattedResult = '';
        
        if (title) {
            formattedResult += `Title: ${title}\n`;
        }
        
        if (company) {
            formattedResult += `Company: ${company}\n`;
        }
        
        if (description) {
            formattedResult += `${description}\n`;
        }
        
        if (jobLocation) {
            formattedResult += `Location: ${jobLocation}\n`;
        }
        
        if (jobUrl) {
            formattedResult += `Job URL: ${jobUrl}`;
        }
        
        formattedResults.push(formattedResult);
    }
    
    return formattedResults.join('\n\n---\n\n');
}

module.exports = { 
    generateEmbedding, 
    embedAndStoreJobs, 
    searchEmbeddings, 
    formatSearchResults 
};
