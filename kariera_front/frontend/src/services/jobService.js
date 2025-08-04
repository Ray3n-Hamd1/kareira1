import api from './api';

// Get job recommendations based on resume upload
export const getJobRecommendations = async (formData) => {
  try {
    const response = await api.post('/jobs/recommendations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    throw error;
  }
};

// Search for jobs based on criteria
export const searchJobs = async (searchParams) => {
  try {
    const response = await api.get('/jobs/search', { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

// Save a job to user favorites
export const saveJob = async (jobId) => {
  try {
    const response = await api.post('/jobs/save', { jobId });
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

// Get saved jobs for current user
export const getSavedJobs = async () => {
  try {
    const response = await api.get('/jobs/saved');
    return response.data;
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    throw error;
  }
};

// Get job details by ID
export const getJobDetails = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting job details:', error);
    throw error;
  }
};
