// src/hooks/useApplicationModal.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import coverLetterService from "../services/coverLetterService";
import applicationService from "../services/applicationService";

/**
 * Hook for managing the job application modal and flow
 * @param {Object} job - The job to apply for
 * @param {Function} onSuccess - Callback when application is successful
 * @param {Function} onError - Callback when application fails
 * @returns {Object} - Application modal state and handlers
 */
export const useApplicationModal = (job, onSuccess, onError) => {
  const { user, userTier = "free", remainingApplications = 3 } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCoverLetterEditor, setShowCoverLetterEditor] = useState(false);
  const [formData, setFormData] = useState({
    // Initialize with user data if available
    firstName: user?.firstName || user?.name?.split(" ")[0] || "",
    lastName: user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    resumeFile: null,
    coverLetter: "",
    additionalNotes: "",
    customQuestions: {},
    agreedToTerms: false,
  });

  // Open the application modal
  const openModal = () => {
    setShowModal(true);
    setCurrentStep(1);
  };

  // Close the application modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate AI cover letter
  const generateCoverLetter = async () => {
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        location: formData.location,
      };

      const coverLetterText = await coverLetterService.generateCoverLetter(
        job,
        userData,
        formData.resumeFile
      );

      handleInputChange("coverLetter", coverLetterText);
      return coverLetterText;
    } catch (error) {
      console.error("Error generating cover letter:", error);
      if (onError) onError(error.message || "Failed to generate cover letter");
      throw error;
    }
  };

  // Open the cover letter editor
  const openCoverLetterEditor = () => {
    setShowCoverLetterEditor(true);
  };

  // Save cover letter from editor
  const saveCoverLetter = (content) => {
    handleInputChange("coverLetter", content);
    setShowCoverLetterEditor(false);
  };

  // Handle application submission
  const submitApplication = async () => {
    try {
      setIsSubmitting(true);

      const result = await applicationService.submitApplication(job, formData);

      if (result.success) {
        closeModal();
        if (onSuccess) onSuccess(result);
      } else {
        throw new Error(result.message || "Application submission failed");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      if (onError) onError(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showModal,
    openModal,
    closeModal,
    isSubmitting,
    currentStep,
    setCurrentStep,
    formData,
    handleInputChange,
    generateCoverLetter,
    submitApplication,
    showCoverLetterEditor,
    openCoverLetterEditor,
    setShowCoverLetterEditor,
    saveCoverLetter,
    userTier,
    remainingApplications,
  };
};

export default useApplicationModal;
