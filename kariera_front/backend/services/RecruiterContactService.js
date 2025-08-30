require('dotenv').config();
const axios = require('axios');

/**
 * @param {string} domain 
 * @returns {Promise<string|null>} 
 * **/
async function getRecruiterEmail(domain) {
  const HUNTER_API_KEY = process.env.HUNTER_API_KEY;

  if (!HUNTER_API_KEY) {
    throw new Error('Missing Hunter.io API key in .env');
  }

  try {
    const response = await axios.get('https://api.hunter.io/v2/domain-search', {
      params: {
        domain: domain,
        api_key: HUNTER_API_KEY
      }
    });

    const emails = response.data?.data?.emails;

    if (!emails || emails.length === 0) {
      console.warn(`No emails found for domain: ${domain}`);
      return null;
    }

    // find someone in HR/recruitment
    const recruiterEmail = emails.find(email =>
      email.position && /recruit|talent|hr|human resources/i.test(email.position)
    );

    return recruiterEmail?.value || emails[0].value || null;
  } catch (error) {
    console.error(`Error fetching recruiter email for ${domain}:`, error.response?.data || error.message);
    return null;
  }
}

module.exports = getRecruiterEmail;
