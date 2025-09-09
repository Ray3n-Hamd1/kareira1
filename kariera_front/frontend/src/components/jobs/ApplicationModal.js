import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  User,
  FileText,
  Edit,
  Briefcase,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import coverLetterApiService from "../../services/coverLetterApiService";

export default function ApplicationModal({
  job,
  isOpen,
  onClose,
  userTier = "free",
  remainingApplications = 3,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resumeFile: null,
    coverLetter: "",
    customQuestions: {},
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetterGenerated, setCoverLetterGenerated] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const fileInputRef = useRef(null);

  // Dynamic questions based on job
  const customQuestions = [
    {
      id: "experience",
      question: `Do you have experience with ${
        job.skills?.[0] || "the required technologies"
      }?`,
      type: "select",
      options: ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"],
      required: true,
    },
    {
      id: "remote",
      question: "Are you comfortable working in a remote/hybrid environment?",
      type: "radio",
      options: ["Yes", "No", "Prefer remote", "Prefer office"],
      required: true,
    },
    {
      id: "motivation",
      question: `What interests you most about working at ${job.company}?`,
      type: "textarea",
      placeholder: "Tell us what motivates you to join our team...",
      required: false,
    },
  ];

  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Resume & Details", icon: FileText },
    { id: 3, title: "Cover Letter", icon: Edit },
    { id: 4, title: "Questions", icon: Briefcase },
    { id: 5, title: "Review & Submit", icon: Send },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleCustomQuestionChange = (questionId, value) => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: {
        ...prev.customQuestions,
        [questionId]: value,
      },
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type === "application/pdf" ||
        file.type.startsWith("application/")
      ) {
        if (file.size <= 10 * 1024 * 1024) {
          handleInputChange("resumeFile", file);
        } else {
          setValidationErrors((prev) => ({
            ...prev,
            resumeFile: "File size must be less than 10MB",
          }));
        }
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          resumeFile: "Please upload a PDF file",
        }));
      }
    }
  };

  const generateCoverLetter = async () => {
    if (userTier === "free" && !remainingApplications) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsGeneratingCoverLetter(true);

    try {
      const jobInfo = {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.skills || [],
        skills: job.skills || [],
      };

      const userInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        experience: job.experienceLevel || "Mid",
        skills: job.skills || [],
      };

      console.log("Generating cover letter for:", jobInfo);

      const result = await coverLetterApiService.generateCoverLetter(
        jobInfo,
        userInfo
      );

      if (result.success) {
        handleInputChange("coverLetter", result.coverLetter);
        setCoverLetterGenerated(true);
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          coverLetter: result.error || "Failed to generate cover letter",
        }));
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setValidationErrors((prev) => ({
        ...prev,
        coverLetter: "Failed to generate cover letter. Please try again.",
      }));
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim())
          errors.firstName = "First name is required";
        if (!formData.lastName.trim())
          errors.lastName = "Last name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (
          formData.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
          errors.email = "Please enter a valid email address";
        }
        break;
      case 2:
        if (!formData.resumeFile)
          errors.resumeFile = "Please upload your resume";
        break;
      case 3:
        if (!formData.coverLetter.trim()) {
          errors.coverLetter = "Please write a cover letter or generate one";
        }
        break;
      case 4:
        customQuestions.forEach((question) => {
          if (question.required && !formData.customQuestions[question.id]) {
            errors[question.id] = "This field is required";
          }
        });
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Create FormData for submission
      const submitData = new FormData();
      submitData.append("jobId", job.id);
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("coverLetter", formData.coverLetter);

      if (formData.resumeFile) {
        submitData.append("resume", formData.resumeFile);
      }

      submitData.append(
        "customQuestions",
        JSON.stringify(formData.customQuestions)
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Application submitted successfully");
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      setValidationErrors({
        submit: "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Apply to {job.company}
              </h2>
              <p className="text-blue-100">{job.title}</p>
              <p className="text-blue-200 text-sm">{job.location}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      currentStep >= step.id
                        ? "bg-white text-blue-600 border-white"
                        : "bg-transparent text-white border-white border-opacity-50"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 transition-colors ${
                        currentStep > step.id
                          ? "bg-white"
                          : "bg-white bg-opacity-30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`text-sm ${
                    currentStep >= step.id ? "text-white" : "text-blue-200"
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your first name"
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.lastName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your last name"
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          )}

          {/* Step 2: Resume Upload */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Resume & Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Resume *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    formData.resumeFile
                      ? "border-green-300 bg-green-50"
                      : validationErrors.resumeFile
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {formData.resumeFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                      <p className="text-lg font-medium text-green-700">
                        {formData.resumeFile.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {(formData.resumeFile.size / 1024 / 1024).toFixed(1)}MB
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Choose different file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-lg font-medium text-gray-700">
                        Upload your resume
                      </p>
                      <p className="text-sm text-gray-500">
                        Drag and drop your file here, or click to browse
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                </div>
                {validationErrors.resumeFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.resumeFile}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Cover Letter */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Cover Letter</h3>
                <button
                  onClick={generateCoverLetter}
                  disabled={isGeneratingCoverLetter}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center"
                >
                  {isGeneratingCoverLetter ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>

              {coverLetterGenerated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700">
                    Cover letter generated successfully!
                  </span>
                </div>
              )}

              <div>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) =>
                    handleInputChange("coverLetter", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 h-64 ${
                    validationErrors.coverLetter
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Write your cover letter here or generate one using AI..."
                />
                {validationErrors.coverLetter && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.coverLetter}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Custom Questions */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">
                Additional Questions
              </h3>

              {customQuestions.map((question) => (
                <div key={question.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {question.question} {question.required && "*"}
                  </label>

                  {question.type === "select" && (
                    <select
                      value={formData.customQuestions[question.id] || ""}
                      onChange={(e) =>
                        handleCustomQuestionChange(question.id, e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[question.id]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select an option</option>
                      {question.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {question.type === "radio" && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={
                              formData.customQuestions[question.id] === option
                            }
                            onChange={(e) =>
                              handleCustomQuestionChange(
                                question.id,
                                e.target.value
                              )
                            }
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "textarea" && (
                    <textarea
                      value={formData.customQuestions[question.id] || ""}
                      onChange={(e) =>
                        handleCustomQuestionChange(question.id, e.target.value)
                      }
                      placeholder={question.placeholder}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24 ${
                        validationErrors[question.id]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  )}

                  {validationErrors[question.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors[question.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Review Application</h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">
                    Personal Information
                  </h4>
                  <p className="text-gray-600">
                    {formData.firstName} {formData.lastName} • {formData.email}
                    {formData.phone && ` • ${formData.phone}`}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Resume</h4>
                  <p className="text-gray-600">
                    {formData.resumeFile
                      ? formData.resumeFile.name
                      : "No file uploaded"}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Cover Letter</h4>
                  <p className="text-gray-600 line-clamp-3">
                    {formData.coverLetter || "No cover letter provided"}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">
                    Additional Responses
                  </h4>
                  {Object.keys(formData.customQuestions).length > 0 ? (
                    <div className="space-y-1">
                      {Object.entries(formData.customQuestions).map(
                        ([key, value]) => (
                          <p key={key} className="text-gray-600 text-sm">
                            {
                              customQuestions.find((q) => q.id === key)
                                ?.question
                            }
                            : {value}
                          </p>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">No additional responses</p>
                  )}
                </div>
              </div>

              {validationErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-700">
                    {validationErrors.submit}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
