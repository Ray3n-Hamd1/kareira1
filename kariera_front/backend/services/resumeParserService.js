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
 You are an expert resume parser.

Extract only the information explicitly present in the CV text below and return it as a valid JSON object in the exact format provided.

- Do not infer, fabricate, or guess missing details.
- If a field is not present in the CV, leave it as an empty string  or empty array  as appropriate.
- Ensure the output is valid, clean JSON with no additional text, explanations, or formatting outside the JSON structure.

CV Text:
'''
${resumeText}
'''

Expected Output Format:
{
"Informations": [
{
"job_to_search_for": "",
"Work Experience": "",
"Key_Responsibilities_and_Achievements": [],
"Skills": [],
"Certifications": [],
"Projects": [],
"recap": ""
}
]
}

Return only the JSON object, with all fields present.
    `;

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
