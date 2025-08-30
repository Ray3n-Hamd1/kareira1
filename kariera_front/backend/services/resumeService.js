const { geminiModel } = require('../config/aiConfig');

function serializeUserInfo(obj, indentLevel = 0) {
  const indent = '  '.repeat(indentLevel);

  if (Array.isArray(obj)) {
    return obj.map(item => {
      const serialized = serializeUserInfo(item, indentLevel + 1);
      return `${indent}- ${serialized.replace(/\n/g, `\n${indent}  `)}`;
    }).join('\n');
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).map(([key, value]) => {
      const serializedValue = serializeUserInfo(value, indentLevel + 1);
      if (typeof value === 'object' && value !== null) {
        return `${indent}${key}:\n${serializedValue}`;
      } else {
        return `${indent}${key}: ${serializedValue}`;
      }
    }).join('\n');
  }

  return `${obj}`;
}
// Refine resume with AI
const refineResumeWithAI = async (userInfo, targetCountry) => {
  try {
    // Convert user info to string format for prompt
    const userInfoStr = serializeUserInfo(userInfo);
    const prompt = `
    You are an expert resume writer and your task is to rewrite and professionally enhance the following resume information to create an ATS-friendly and role-specific resume for a position in ${targetCountry} for the role of {userRole}

You can use the following context information  :

- Candidate Information: ${userInfoStr}
Your output must follow these strict guidelines:

- Do not use any placeholders, suggestions, or incomplete sections. Use only the information provided. Do not comment, suggest, or fabricate.
- Do not guess any missing or unspecified information. If a detail is not provided, leave the corresponding field empty or omit it entirely.
- Use technical terms, jargon, and domain-specific language only when directly supported by the user’s provided information or clearly implied by their listed skills and experience. Avoid introducing unfamiliar or unrelated concepts.
- Use standard sections: Professional Summary, Skills, Work Experience, Education, Certifications,languages  and Projects (if applicable).
- Divide the skills into clear, ATS-friendly categories such as: Programming Languages, Frameworks & Libraries, Tools & Platforms, and Other Relevant Skills.
- Ensure each category includes only the relevant items from the candidate's information. Do not invent or add unlisted skills.
- All achievements and responsibilities must be written as clear bullet points and expanded only with realistic and context-aware elaboration based on the provided information.
- The resume must be optimized for ATS parsing: plain text only, no tables, no columns, and no markdown formatting.
- Use professional and concise language tailored to the norms and expectations in ${targetCountry}.
- Ensure the resume is immediately usable without additional editing or rewriting.
- Do not include notes to the user, explanations, or formatting instructions in your output.

Final output:  complete,plain-text, fully formatted resume strictly based on the provided information.
   
 `;



    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    let raw = responseText.trim();
    raw = raw.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();

    return raw;
  } catch (error) {
    console.error('Error refining resume with AI:', error);
    throw new Error('Failed to refine resume');
  }
};
const matchCVWithAI = async (userInfo, jobDescription) => {
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
    You are a CV-job matching expert.

Your task is to evaluate the compatibility between a candidate's resume and a job description. Analyze the alignment in terms of skills, experience, qualifications, tools, responsibilities, and industry relevance.

Based on your analysis, return:

- A compatibility score between 0 and 100 (where 100 means perfect match)
- A concise explanation of the key factors that influenced the score

Use only the information explicitly provided in the inputs. Do not guess or assume any additional / non-realistic information

Output your response in the following valid JSON format:
{
  "score": "0-100%",
  "analysis": {
      "skills_match": "0-100%",
      "experience_match":"0-100%",
      "education_match": "0-100%",
      "tools_and_tech": "0-100%",
      "overall_summary": "The candidate matches most skills and has relevant experience in developing with python which is needed in the job....."
    }
}
    `;
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    try {
      let raw = responseText.trim();
      raw = raw.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();

      let jsonResponse;
        jsonResponse = JSON.parse(raw);
        return jsonResponse;
      } catch (err) {
        console.error("Failed to parse AI response:", raw);
        throw new Error("Invalid JSON response from AI");
      }
    } catch (error) {
      console.error('Error matching CV with AI:', error);
      throw new Error(`Failed to match CV, ${error}`);
    }
  };
  module.exports = {
    refineResumeWithAI,
    matchCVWithAI
  };
