const fs = require('fs');
const util = require('util');
const pdf = require('pdf-parse');
const { geminiModel } = require('../config/aiConfig');

// Convert fs.readFile to Promise
const readFile = util.promisify(fs.readFile);

async function parseResume(filePath) {
  try {
    console.log(`Parsing resume from: ${filePath}`);
    
    // Step 1: Extract text from PDF
    const dataBuffer = await readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    const resumeText = pdfData.text;
    console.log('PDF parsed successfully, extracting information...');
    
    // Step 2: Extract structured information using Gemini AI
    const prompt = `
    You are a CV filter system. Use these informations in the CV: '${resumeText}'. Note that the output should be in JSON format:
    {
        "Informations": [
            {
                "job_to_search_for": "string representing job title",
                "Work Experience": "string (example: 2 years)",
                "Key_Responsibilities_and_Achievements": ["responsibility1", "responsibility2", "responsibility3"],
                "Skills": ["skill1", "skill2", "skill3"],
                "Certifications": ["certification1", "certification2"],
                "Projects": ["project1", "project2"],
                "recap": "brief summary of profile"
            }
        ]
    }
    `;
    
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      const jsonResponse = JSON.parse(responseText);
      const info = jsonResponse.Informations[0];
      
      return {
        jobToSearchFor: info.job_to_search_for || '',
        workExperience: info["Work Experience"] || '',
        responsibilities: Array.isArray(info.Key_Responsibilities_and_Achievements) 
          ? info.Key_Responsibilities_and_Achievements.join(', ') 
          : '',
        skills: Array.isArray(info.Skills) ? info.Skills.join(', ') : '',
        certifications: Array.isArray(info.Certifications) ? info.Certifications.join(', ') : '',
        projects: Array.isArray(info.Projects) ? info.Projects.join(', ') : '',
        recap: info.recap || ''
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse resume structure');
    }
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}

module.exports = { parseResume };
