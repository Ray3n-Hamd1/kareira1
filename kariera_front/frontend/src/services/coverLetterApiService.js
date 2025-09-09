import api from "./api";

export const coverLetterApiService = {
  generateCoverLetter: async (
    jobInfo,
    userInfo = null,
    customInstructions = null
  ) => {
    try {
      const requestData = {
        job_title: jobInfo.title || jobInfo.job_title,
        company: jobInfo.company,
        location: jobInfo.location,
        description: jobInfo.description,
        requirements:
          jobInfo.requirements || jobInfo.qualifications || jobInfo.skills,
        salary: jobInfo.salary,
        jobType: jobInfo.jobType || jobInfo.type,
        experienceLevel: jobInfo.experienceLevel || jobInfo.experience_level,
        skills: jobInfo.skills,
        benefits: jobInfo.benefits,
        customInstructions,
      };

      if (userInfo) {
        Object.assign(requestData, userInfo);
      }

      console.log("Generating cover letter with data:", requestData);

      const response = await api.post("/cover-letter/generate", requestData);

      return {
        success: true,
        coverLetter: response.data.coverLetter,
        message: response.data.message || "Cover letter generated successfully",
      };
    } catch (error) {
      console.error("Generate cover letter error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to generate cover letter",
      };
    }
  },
};

export default coverLetterApiService;
