const fs = require('fs');
const { geminiModel } = require('../config/aiConfig');

// Parse resume from PDF
const parseResume = async (filePath) => {
  try {
    // In a real implementation, you'd use a PDF parsing library here
    // For now, we'll use a placeholder
    
    // Simulating PDF text extraction
    const documentContent = `This is placeholder text for PDF content from ${filePath}`;
    
    // Send to Gemini for parsing
    const prompt = `
    You are a CV filter system. Use these informations in the CV: '${documentContent}'. Note that the output should be in JSON format:
    {
        "Informations": [
            {
                "job_to_search_for": str,
                "Work Experience": str (example: 2 years),
                "Key_Responsibilities_and_Achievements": [str, str, str, ...],
                "Skills": [str, str, str, str, ...],
                "Certifications": [str, str, str, ...],
                "Projects": [str, str, str, ...],
                "recap": str
            }
        ]
    }
    `;
    
    const result = await geminiModel.generateContent(prompt);
    const jsonResponse = JSON.parse(result.response.text());
    
    const info = jsonResponse.Informations[0];
    
    return {
      jobToSearchFor: info.job_to_search_for,
      workExperience: info["Work Experience"],
      responsibilities: info.Key_Responsibilities_and_Achievements.join(', '),
      skills: info.Skills.join(', '),
      certifications: info.Certifications.join(', '),
      projects: info.Projects.join(', '),
      recap: info.recap
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume');
  }
};

module.exports = {
  parseResume
};
