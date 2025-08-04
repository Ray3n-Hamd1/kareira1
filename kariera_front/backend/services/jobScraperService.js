const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('../models/UserJob');
const { embedAndStoreJobs } = require('./vectorService');

// Mock function to scrape jobs - in production, you'd use a proper job scraping library
async function scrapeJobs() {
  try {
    console.log('Starting job scraping process...');
    
    // In a real implementation, you would use a proper job scraping library
    // This is a placeholder that generates sample data
    const jobs = generateSampleJobs(15);
    
    console.log(`Found ${jobs.length} jobs`);

    // Convert jobs to the right format
    const selectedJobs = jobs.map(job => ({
      id: job.id || `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      location: job.location || '',
      title: job.title || '',
      job_url: job.job_url || '',
      is_remote: job.is_remote || false,
      description: job.description || '',
      company: job.company || ''
    })).filter(job => job.description && job.job_url);

    // Save to CSV
    const csvFilePath = path.join(__dirname, '../csv_Files/jobs.csv');
    await saveJobsToCSV(selectedJobs, csvFilePath);
    
    // Store in MongoDB and vector database
    await storeJobsInDatabase(selectedJobs);
    
    return selectedJobs;
  } catch (error) {
    console.error('Error scraping jobs:', error);
    return [];
  }
}

// Generate sample jobs for testing
function generateSampleJobs(count) {
  const jobTypes = ['Software Engineer', 'Data Scientist', 'UX Designer', 'Product Manager', 'Marketing Specialist'];
  const companies = ['TechCorp', 'DataMasters', 'DesignThink', 'ProductInc', 'MarketGenius'];
  const locations = ['New York, USA', 'London, UK', 'Paris, France', 'Berlin, Germany', 'Tokyo, Japan'];
  const jobs = [];
  
  for (let i = 0; i < count; i++) {
    const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const isRemote = Math.random() > 0.5;
    
    jobs.push({
      id: `job-${Date.now()}-${i}`,
      title: `${jobType} Intern`,
      company: company,
      location: location,
      is_remote: isRemote,
      job_url: `https://example.com/jobs/${company.toLowerCase().replace(' ', '-')}/${jobType.toLowerCase().replace(' ', '-')}`,
      description: `We are looking for a ${jobType} Intern to join our team at ${company}. The ideal candidate will have experience with relevant technologies and tools. This is a great opportunity to learn and grow in a dynamic environment.`
    });
  }
  
  return jobs;
}

// Save jobs to CSV
async function saveJobsToCSV(jobs, csvFilePath) {
  try {
    let existingJobs = [];
    let updatedJobs = [];
    
    // Check if CSV file exists
    if (fs.existsSync(csvFilePath)) {
      // Read existing jobs
      existingJobs = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
      });
      
      // Find new jobs that are not duplicates
      const existingIds = existingJobs.map(job => job.id);
      const newJobs = jobs.filter(job => !existingIds.includes(job.id));
      console.log(`Found ${newJobs.length} new jobs to add`);
      
      updatedJobs = [...existingJobs, ...newJobs];
    } else {
      updatedJobs = jobs;
    }
    
    // Define CSV headers
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'location', title: 'location' },
        { id: 'title', title: 'title' },
        { id: 'job_url', title: 'job_url' },
        { id: 'is_remote', title: 'is_remote' },
        { id: 'description', title: 'description' },
        { id: 'company', title: 'company' }
      ]
    });
    
    // Write updated jobs to CSV
    await csvWriter.writeRecords(updatedJobs);
    console.log(`Successfully saved ${updatedJobs.length} jobs to CSV`);
    
    return updatedJobs;
  } catch (error) {
    console.error('Error saving jobs to CSV:', error);
    throw error;
  }
}

// Store jobs in MongoDB and vector database
async function storeJobsInDatabase(jobs) {
  try {
    console.log(`Storing ${jobs.length} jobs in database...`);
    
    // Store in MongoDB
    for (const job of jobs) {
      await Job.findOneAndUpdate(
        { id: job.id },
        job,
        { upsert: true, new: true }
      );
    }
    
    console.log('Jobs saved to MongoDB');
    
    // Embed and store in vector database
    await embedAndStoreJobs(jobs);
    
    console.log('Job storage complete');
  } catch (error) {
    console.error('Error storing jobs in database:', error);
    throw error;
  }
}

module.exports = { scrapeJobs };
