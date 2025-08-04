import api from './api';

// Generate a cover letter for a job
export const generateCoverLetter = async (jobInfo) => {
  try {
    const response = await api.post('/cover-letter/generate', jobInfo);
    return response.data;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
};

// Save generated cover letter
export const saveCoverLetter = async (coverLetterData) => {
  try {
    const response = await api.post('/cover-letter/save', coverLetterData);
    return response.data;
  } catch (error) {
    console.error('Error saving cover letter:', error);
    throw error;
  }
};

// Get saved cover letters
export const getSavedCoverLetters = async () => {
  try {
    const response = await api.get('/cover-letter/saved');
    return response.data;
  } catch (error) {
    console.error('Error getting saved cover letters:', error);
    throw error;
  }
};
