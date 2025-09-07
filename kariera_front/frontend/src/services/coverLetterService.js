// src/services/coverLetterService.js
import axios from "axios";

/**
 * Service for generating AI cover letters
 */
export const coverLetterService = {
  /**
   * Generate a cover letter based on job and user data
   * @param {Object} jobData - The job details
   * @param {Object} userData - The user information
   * @param {File} resumeFile - The user's resume file
   * @returns {Promise<string>} - The generated cover letter
   */
  async generateCoverLetter(jobData, userData, resumeFile = null) {
    try {
      // For development without API
      if (process.env.REACT_APP_USE_MOCK_API === "true") {
        return await this.generateMockCoverLetter(jobData, userData);
      }

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("job", JSON.stringify(jobData));
      formData.append("user", JSON.stringify(userData));

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await axios.post(
        "/api/cover-letter/generate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.coverLetter;
    } catch (error) {
      console.error("Error generating cover letter:", error);
      throw new Error("Failed to generate cover letter. Please try again.");
    }
  },

  /**
   * Generate a mock cover letter for development/testing
   * @param {Object} jobData - The job details
   * @param {Object} userData - The user information
   * @returns {Promise<string>} - The generated cover letter
   */
  async generateMockCoverLetter(jobData, userData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return `Dear Hiring Manager,

I am excited to apply for the ${jobData.title} position at ${
      jobData.company
    }. With my background in ${
      jobData.skills?.slice(0, 2).join(" and ") || "software development"
    }, I am confident I can contribute effectively to your team.

In my previous experience, I have developed strong skills in ${
      jobData.skills?.join(", ") || "relevant technologies"
    } and have worked on projects that align closely with your requirements.

I am particularly drawn to ${
      jobData.company
    }'s mission of delivering seamless, visually appealing interfaces aligned with your brand. My background in user research, prototyping, and collaboration with cross-functional teams has equipped me to create designs that are not only aesthetically pleasing but also user-centered.

I would love the opportunity to bring my expertise to your team and contribute to the continued success of ${
      jobData.company
    }. Thank you for considering my application.

Sincerely,
${userData.firstName} ${userData.lastName}`;
  },

  /**
   * Edit an existing cover letter with AI assistance
   * @param {string} existingLetter - Current cover letter content
   * @param {Object} jobData - The job details
   * @param {Object} instructions - Instructions for editing
   * @returns {Promise<string>} - The enhanced cover letter
   */
  async enhanceCoverLetter(existingLetter, jobData, instructions) {
    try {
      // For development without API
      if (process.env.REACT_APP_USE_MOCK_API === "true") {
        return await this.enhanceMockCoverLetter(existingLetter, instructions);
      }

      const response = await axios.post("/api/cover-letter/enhance", {
        coverLetter: existingLetter,
        job: jobData,
        instructions,
      });

      return response.data.enhancedLetter;
    } catch (error) {
      console.error("Error enhancing cover letter:", error);
      throw new Error("Failed to enhance cover letter. Please try again.");
    }
  },

  /**
   * Enhance a mock cover letter for development/testing
   * @param {string} existingLetter - Current cover letter content
   * @param {Object} instructions - Instructions for editing
   * @returns {Promise<string>} - The enhanced cover letter
   */
  async enhanceMockCoverLetter(existingLetter, instructions) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (instructions.tone === "professional") {
      return existingLetter.replace(
        /I am excited to apply/i,
        "I am writing to express my interest in applying"
      );
    } else if (instructions.tone === "enthusiastic") {
      return existingLetter.replace(
        /I am excited to apply/i,
        "I am thrilled to apply"
      );
    } else {
      // Add more achievements if requested
      if (instructions.emphasize === "achievements") {
        const sentences = existingLetter.split(".");
        const insertPosition = Math.min(sentences.length - 2, 3);

        sentences.splice(
          insertPosition,
          0,
          " In my most recent role, I increased user engagement by 35% through implementing data-driven design solutions"
        );

        return sentences.join(".");
      }

      return existingLetter;
    }
  },
};

export default coverLetterService;
