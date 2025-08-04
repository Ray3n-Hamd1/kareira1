import api from "./api";

// Get current user's resume
export const getUserResume = async () => {
  try {
    const response = await api.get("/resume");
    return response.data;
  } catch (error) {
    console.error("Error getting user resume:", error);
    throw error;
  }
};

// Save personal information section
export const savePersonalInfo = async (personalInfo) => {
  try {
    const response = await api.put("/resume/personal-info", personalInfo);
    return response.data;
  } catch (error) {
    console.error("Error saving personal info:", error);
    throw error;
  }
};

// Save education section
export const saveEducation = async (education) => {
  try {
    const response = await api.put("/resume/education", education);
    return response.data;
  } catch (error) {
    console.error("Error saving education:", error);
    throw error;
  }
};

// Save experience section
export const saveExperience = async (experience) => {
  try {
    const response = await api.put("/resume/experience", experience);
    return response.data;
  } catch (error) {
    console.error("Error saving experience:", error);
    throw error;
  }
};

// Save projects section
export const saveProjects = async (projects) => {
  try {
    const response = await api.put("/resume/projects", projects);
    return response.data;
  } catch (error) {
    console.error("Error saving projects:", error);
    throw error;
  }
};

// Save skills section
export const saveSkills = async (skills) => {
  try {
    const response = await api.put("/resume/skills", skills);
    return response.data;
  } catch (error) {
    console.error("Error saving skills:", error);
    throw error;
  }
};

// Refine resume for specific country
export const refineResume = async (targetCountry) => {
  try {
    const response = await api.post("/resume/refine", { targetCountry });
    return response.data;
  } catch (error) {
    console.error("Error refining resume:", error);
    throw error;
  }
};

// Generate PDF resume from data
export const generatePDFResume = async (resumeData) => {
  try {
    const response = await api.post(
      "/resume/generate-pdf",
      { refinedResume: resumeData },
      {
        responseType: "blob", // Important for receiving binary data
      }
    );

    // Create a download link for the PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (error) {
    console.error("Error generating PDF resume:", error);
    throw error;
  }
};
// Add to your existing resumeService.js
export const saveWorkHistory = async (workHistory) => {
  try {
    const response = await api.put("/resume/work-history", workHistory);
    return response.data;
  } catch (error) {
    console.error("Error saving work history:", error);
    throw error;
  }
};

export const saveJobDescription = async (jobDescription) => {
  try {
    const response = await api.put("/resume/job-description", jobDescription);
    return response.data;
  } catch (error) {
    console.error("Error saving job description:", error);
    throw error;
  }
};

export const saveAdditionalEducation = async (additionalEducation) => {
  try {
    const response = await api.put(
      "/resume/additional-education",
      additionalEducation
    );
    return response.data;
  } catch (error) {
    console.error("Error saving additional education:", error);
    throw error;
  }
};

export const saveCertifications = async (certifications) => {
  try {
    const response = await api.put("/resume/certifications", certifications);
    return response.data;
  } catch (error) {
    console.error("Error saving certifications:", error);
    throw error;
  }
};

export const saveLinks = async (links) => {
  try {
    const response = await api.put("/resume/links", links);
    return response.data;
  } catch (error) {
    console.error("Error saving links:", error);
    throw error;
  }
};

export const saveBackgroundSummary = async (backgroundSummary) => {
  try {
    const response = await api.put(
      "/resume/background-summary",
      backgroundSummary
    );
    return response.data;
  } catch (error) {
    console.error("Error saving background summary:", error);
    throw error;
  }
};

export const saveSoftwareSkills = async (softwareSkills) => {
  try {
    const response = await api.put("/resume/software-skills", softwareSkills);
    return response.data;
  } catch (error) {
    console.error("Error saving software skills:", error);
    throw error;
  }
};

export const saveInterestsHobbies = async (interestsHobbies) => {
  try {
    const response = await api.put(
      "/resume/interests-hobbies",
      interestsHobbies
    );
    return response.data;
  } catch (error) {
    console.error("Error saving interests and hobbies:", error);
    throw error;
  }
};

export const enhanceWithAI = async (resumeData) => {
  try {
    const response = await api.post("/resume/enhance", resumeData);
    return response.data;
  } catch (error) {
    console.error("Error enhancing resume with AI:", error);
    throw error;
  }
};

export const deleteWorkExperience = async (experienceId) => {
  try {
    const response = await api.delete(
      `/resume/work-experience/${experienceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting work experience:", error);
    throw error;
  }
};

export const deleteEducation = async (educationId) => {
  try {
    const response = await api.delete(`/resume/education/${educationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting education:", error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/resume/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
