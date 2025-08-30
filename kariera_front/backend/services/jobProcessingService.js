const { geminiModel } = require('../config/aiConfig');
const { searchEmbeddings, formatSearchResults } = require('./vectorGoogleService');

// Convert resume data to search query
function buildSearchQuery(resumeData, jobTitle, country) {
    const { recap, workExperience, responsibilities, skills, certifications, projects } = resumeData;

    return `${recap || ''} With ${workExperience || '0 years'} of work experience I'm searching for '${jobTitle}' in country: '${country}'. ${responsibilities ? `I have been responsible for ${responsibilities}.` : ''
        } ${skills ? `My skills include ${skills}.` : ''
        } ${certifications ? `I have earned certifications such as ${certifications}.` : ''
        } ${projects ? `I have worked on projects like ${projects}.` : ''
        }`;
}

// Search for matching jobs based on resume data
async function searchJobMatches(resumeData, numberOfJobs, country, jobTitle) {
    try {
        console.log(`Searching for ${numberOfJobs} ${jobTitle} positions in ${country}...`);

        const searchQuery = buildSearchQuery(resumeData, jobTitle, country);
        console.log('Query built successfully');

        const searchResults = await searchEmbeddings(searchQuery, numberOfJobs);
        console.log(`Found ${searchResults.matches.length} matches`);

        const formattedResults = formatSearchResults(searchResults);
        return formattedResults;
    } catch (error) {
        console.error('Error searching for job matches:', error);
        throw error;
    }
}

// Process search results to get formatted job listings
async function getInternships(parseSearchResult) {
    try {
        const prompt = `
you are a job  recommendation system. Use these search results: ${parseSearchResult} to format them in a better structure . Note that the output should be in JSON format and make sure the JSON is correct:        {
            "jobs": [
                {
                    "jobTitle": "Brand Marketing Intern",
                    "link": "https://www.example.com/job/brand-marketing-intern",
                    "description": "Assist with marketing campaigns",
                    "location": "Chicago, IL"
                },
                {
                    "jobTitle": "Software Engineering Intern",
                    "link": "https://www.example.com/job/software-engineering-intern",
                    "description": "Work on backend systems",
                    "location": "San Francisco, CA"
                }
            ]
            Return ONLY valid JSON. Do not include code blocks, comments, or extra text
        }`;

        console.log('Requesting job formatting from Gemini...');
        const result = await geminiModel.generateContent(prompt);
        const responseText = result.response.text();

        try {
            let raw = responseText.trim();
            raw = raw.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();

            let jsonResponse;
            try {
                jsonResponse = JSON.parse(raw);
            } catch (err) {
                console.error("Failed to parse AI response:", raw);
                throw new Error("Invalid JSON response from AI");
            }

            return jsonResponse.jobs || [];
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            throw new Error('Invalid JSON response from AI');
        }
    } catch (error) {
        console.error('Error processing job data:', error);
        return [];
    }
}

// Main function to find job recommendations based on resume
async function findJobRecommendations(resumeData, numberOfJobs, country, jobTitle) {
    try {
        // Step 1: Search for matching jobs
        const searchResults = await searchJobMatches(resumeData, numberOfJobs, country, jobTitle);

        // Step 2: Process results into structured job recommendations
        const jobRecommendations = await getInternships(searchResults);

        return jobRecommendations;
    } catch (error) {
        console.error('Error finding job recommendations:', error);
        throw error;
    }
}

module.exports = {
    searchJobMatches,
    getInternships,
    findJobRecommendations
};
