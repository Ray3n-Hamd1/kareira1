const { geminiModel } = require('../config/aiConfig');

// Refine resume with AI
const refineResumeWithAI = async (userInfo, targetCountry) => {
  try {
    // Convert user info to string format for prompt
    const userInfoStr = Object.entries(userInfo)
      .map(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          return `${key}: ${JSON.stringify(value)}`;
        } else {
          return `${key}: ${value}`;
        }
      })
      .join('\n');
    
    const prompt = `
    Refine the following resume information for a position in ${targetCountry}. 
    Ensure it is professional, ATS-friendly, and highlights the most relevant aspects. 
    Use the details provided:

    ${userInfoStr}

    Please expand on this information to create a comprehensive resume profile.
    - Use the information provided to elaborate. 
    - I want the version you output to be final. 
    - Elaborate within my capabilities; I do not want things I did not do to be on the resume. 
    - Do the best job you can.
    `;
    
    const result = await geminiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error refining resume with AI:', error);
    throw new Error('Failed to refine resume');
  }
};

module.exports = {
  refineResumeWithAI
};
