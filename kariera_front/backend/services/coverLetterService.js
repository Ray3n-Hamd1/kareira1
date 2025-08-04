const { geminiModel } = require('../config/aiConfig');

// Generate a cover letter
async function generateCoverLetter(userInfo, jobInfo) {
  try {
    // Extract user information
    const userName = userInfo.name || '';
    
    // Format skills
    let userSkills = '';
    if (Array.isArray(userInfo.skills)) {
      userSkills = userInfo.skills.join(', ');
    } else if (typeof userInfo.skills === 'string') {
      userSkills = userInfo.skills;
    }
    
    // Format experience
    let userExperience = '';
    if (Array.isArray(userInfo.professional_experience)) {
      userExperience = userInfo.professional_experience
        .map(exp => `${exp.job_title || ''} at ${exp.company || ''}`)
        .join(', ');
    }
    
    // Format certifications
    let userCertifications = '';
    if (Array.isArray(userInfo.certifications)) {
      userCertifications = userInfo.certifications.join(', ');
    } else if (typeof userInfo.certifications === 'string') {
      userCertifications = userInfo.certifications;
    }
    
    const prompt = `
    Generate a professional and ATS-friendly cover letter for a job application. The applicant is ${userName}, applying for the position of ${jobInfo.jobTitle || 'the position'} at ${jobInfo.company || 'the company'}, located in ${jobInfo.location || 'the location'}. 
    
    The applicant has skills in ${userSkills}, with experience in ${userExperience}, and holds the following certifications: ${userCertifications}. 
    
    The job description is: ${jobInfo.description || 'A position requiring skills and experience in the relevant field'}.

    The cover letter should:
    - Begin with a brief introduction stating the applicant's interest in the position.
    - Highlight only the most relevant skills and experiences that match the job requirements.
    - Focus on those that directly relate to ${jobInfo.jobTitle || 'the role'} and the responsibilities listed in the job description.
    - Avoid placeholders like [Your Name], [Your Address], [Your Phone Number], [Your Email Address], [Date], or any reference to where the job was advertised.
    - Focus on specific achievements related to the job description rather than general experience.
    - End with a strong conclusion, emphasizing the applicant's enthusiasm for the role and inviting further discussion.
    - Make it sound very human-like.
    - Ensure the cover letter is concise and does not exceed 400 words.
    
    Make the response in this JSON format:
    {
      "to": "Hiring Manager",
      "from": "${userName}",
      "subject": "Application for ${jobInfo.jobTitle || 'the position'} Position",
      "body": "The actual cover letter content"
    }
    `;
    
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error('Failed to generate cover letter');
  }
}

module.exports = { generateCoverLetter };
