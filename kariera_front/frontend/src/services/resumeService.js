import api from './api';

// Get current user's resume
export const getUserResume = async () => {
  try {
    const response = await api.get('/resume');
    return response.data;
  } catch (error) {
    console.error('Error getting user resume:', error);
    throw error;
  }
};

// Save personal information section
export const savePersonalInfo = async (personalInfo) => {
  try {
    const response = await api.put('/resume/personal-info', personalInfo);
    return response.data;
  } catch (error) {
    console.error('Error saving personal info:', error);
    throw error;
  }
};

// Save education section
export const saveEducation = async (education) => {
  try {
    const response = await api.put('/resume/education', education);
    return response.data;
  } catch (error) {
    console.error('Error saving education:', error);
    throw error;
  }
};

// Save experience section
export const saveExperience = async (experience) => {
  try {
    const response = await api.put('/resume/experience', experience);
    return response.data;
  } catch (error) {
    console.error('Error saving experience:', error);
    throw error;
  }
};

// Save projects section
export const saveProjects = async (projects) => {
  try {
    const response = await api.put('/resume/projects', projects);
    return response.data;
  } catch (error) {
    console.error('Error saving projects:', error);
    throw error;
  }
};

// Save skills section
export const saveSkills = async (skills) => {
  try {
    const response = await api.put('/resume/skills', skills);
    return response.data;
  } catch (error) {
    console.error('Error saving skills:', error);
    throw error;
  }
};

// Refine resume for specific country
export const refineResume = async (targetCountry) => {
  try {
    const response = await api.post('/resume/refine', { targetCountry });
    return response.data;
  } catch (error) {
    console.error('Error refining resume:', error);
    throw error;
  }
};

// Generate PDF resume from data
export const generatePDFResume = async (resumeData) => {
  try {
    const response = await api.post('/resume/generate-pdf', { refinedResume: resumeData }, {
      responseType: 'blob' // Important for receiving binary data
    });
    
    // Create a download link for the PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'resume.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true };
  } catch (error) {
    console.error('Error generating PDF resume:', error);
    throw error;
  }
};
