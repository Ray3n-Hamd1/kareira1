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
    You are an expert cover letter writer.

Generate a professional, ATS-compatible, and engaging cover letter for a job application but written in a natural and engaging tone suitable for a human recruiter.. Write it as a plain-text letter, formatted in JSON using the structure below.

You can use these information  :

- Applicant Name: ${userName}
- Target Job Title: ${jobInfo.jobTitle}
- Company: ${jobInfo.company}
- Location: ${jobInfo.location}
- Applicant Skills: ${userSkills}
- Experience: ${userExperience}
- Certifications: ${userCertifications}
- Job Description: ${jobInfo.description}

If any input field is missing or empty, omit that part of the content naturally without inserting default text.

Please make sure that you: 

- Begin with a brief introduction expressing the applicant’s interest in the position.
- Highlight only the most relevant skills and achievements that align with the job requirements.
- Focus on accomplishments and experience that are directly tied to the responsibilities listed in the job description.
- Avoid using any placeholders like [Your Name], [Date], or where the job was advertised.
- Make the tone professional, warm, and human, not robotic or generic.
- Keep the cover letter concise (maximum 400 words).
- Do not fabricate or assume any information not provided.
- The response must be a valid JSON object in the format below.

Output JSON:
{
"to": "Hiring Manager",
"from": "${userName}",
"subject": "Application for ${jobInfo.jobTitle} Position",
"body": "The full cover letter content here."
}

Return only the JSON object. Do not include any extra commentary or formatting.”
    `;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    let raw = responseText.trim();
    raw = raw.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(raw);
      return jsonResponse;
    } catch (err) {
      console.error("Failed to parse AI response:", raw);
      throw new Error("Invalid JSON response from AI");
    }
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error('Failed to generate cover letter');
  }
}

module.exports = { generateCoverLetter };
