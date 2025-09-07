// src/components/jobs/ApplicationModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Send,
  CheckCircle,
  AlertCircle,
  Zap,
  Sparkles,
  Download,
  Edit,
  Save,
  ArrowLeft,
  ArrowRight,
  Calendar,
  DollarSign,
  Clock,
  Globe,
  Building2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ApplicationModal({
  job,
  onClose,
  onSubmit,
  userTier = "free",
  remainingApplications = 0,
}) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // 1-5 steps
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const fileInputRef = useRef(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Info (Step 1)
    firstName: user?.firstName || user?.name?.split(" ")[0] || "",
    lastName: user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.city || "",
    linkedinUrl: "",
    portfolioUrl: "",

    // Resume & Details (Step 2)
    resumeFile: null,
    availableStartDate: "",
    expectedSalary: "",
    noticePeriod: "",
    workAuthorization: "",

    // Cover Letter (Step 3)
    coverLetter: "",
    additionalNotes: "",

    // Questions (Step 4)
    customQuestions: {},

    // Review (Step 5)
    agreedToTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [coverLetterGenerated, setCoverLetterGenerated] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  // Mock custom questions based on job
  const customQuestions = [
    {
      id: "experience",
      question: `How many years of experience do you have with ${
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

    // Clear validation error for this field
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
          // 10MB limit
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
      // Simulate AI cover letter generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const generatedLetter = `Dear Hiring Manager,

I am excited to apply for the ${job.title} position at ${
        job.company
      }. With my background in ${
        job.skills?.slice(0, 2).join(" and ") || "software development"
      }, I am confident I can contribute effectively to your team.

In my previous experience, I have developed strong skills in ${
        job.skills?.join(", ") || "relevant technologies"
      } and have worked on projects that align closely with your requirements.

I am particularly drawn to ${
        job.company
      }'s mission of delivering seamless, visually appealing interfaces aligned with your brand. My background in user research, prototyping, and collaboration with cross-functional teams has equipped me to create designs that are not only aesthetically pleasing but also user-centered.

I would love the opportunity to bring my expertise to your team and contribute to the continued success of ${
        job.company
      }. Thank you for considering my application.

Sincerely,
${formData.firstName} ${formData.lastName}`;

      handleInputChange("coverLetter", generatedLetter);
      setCoverLetterGenerated(true);
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
          errors.coverLetter = "Cover letter is required";
        }
        break;

      case 4:
        customQuestions.forEach((question) => {
          if (question.required && !formData.customQuestions[question.id]) {
            errors[`question_${question.id}`] = "This question is required";
          }
        });
        break;

      case 5:
        if (!formData.agreedToTerms) {
          errors.agreedToTerms = "You must agree to the terms and conditions";
        }
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
    if (!validateStep(5)) return;

    if (userTier === "free" && remainingApplications <= 0) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting application:", error);
      setValidationErrors((prev) => ({
        ...prev,
        submit: "Failed to submit application. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Personal Information
            </h3>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`w-full px-4 py-3 bg-gray-700 border ${
                    validationErrors.firstName
                      ? "border-red-500"
                      : "border-gray-600"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Your first name"
                />
                {validationErrors.firstName && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`w-full px-4 py-3 bg-gray-700 border ${
                    validationErrors.lastName
                      ? "border-red-500"
                      : "border-gray-600"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Your last name"
                />
                {validationErrors.lastName && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${
                    validationErrors.email
                      ? "border-red-500"
                      : "border-gray-600"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Your email address"
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Social and Portfolio Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) =>
                    handleInputChange("linkedinUrl", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) =>
                    handleInputChange("portfolioUrl", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Resume & Job Details
            </h3>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resume *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  validationErrors.resumeFile
                    ? "border-red-500"
                    : "border-gray-600 hover:border-purple-500"
                }`}
              >
                {formData.resumeFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <div>
                      <p className="text-white font-medium">
                        {formData.resumeFile.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange("resumeFile", null)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Upload different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-white font-medium mb-2">
                        Upload your resume
                      </p>
                      <p className="text-sm text-gray-400 mb-4">
                        PDF format, max 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </button>
                  </div>
                )}
              </div>
              {validationErrors.resumeFile && (
                <p className="text-red-400 text-sm mt-1">
                  {validationErrors.resumeFile}
                </p>
              )}
            </div>

            {/* Additional Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formData.availableStartDate}
                    onChange={(e) =>
                      handleInputChange("availableStartDate", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Salary
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.expectedSalary}
                    onChange={(e) =>
                      handleInputChange("expectedSalary", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. $70,000 - $90,000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notice Period
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.noticePeriod}
                    onChange={(e) =>
                      handleInputChange("noticePeriod", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="">Select notice period</option>
                    <option value="immediate">Immediate</option>
                    <option value="1week">1 week</option>
                    <option value="2weeks">2 weeks</option>
                    <option value="1month">1 month</option>
                    <option value="2months">2 months</option>
                    <option value="3months+">3+ months</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Work Authorization
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.workAuthorization}
                    onChange={(e) =>
                      handleInputChange("workAuthorization", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="">Select authorization status</option>
                    <option value="citizen">
                      Citizen / Permanent Resident
                    </option>
                    <option value="workVisa">Work Visa</option>
                    <option value="needSponsorship">
                      Need Visa Sponsorship
                    </option>
                    <option value="studentVisa">Student Visa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Cover Letter</h3>
              {coverLetterGenerated && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Enhanced with AI
                </span>
              )}
            </div>

            {/* AI Generation Option */}
            {!coverLetterGenerated && (
              <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-white mb-1">
                      Generate AI Cover Letter
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Let our AI create a personalized cover letter for this job
                      based on your resume and the job description.
                    </p>
                    <button
                      onClick={generateCoverLetter}
                      disabled={isGeneratingCoverLetter}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingCoverLetter ? (
                        <>
                          <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Cover Letter
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cover Letter Text Area */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Letter *
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) =>
                  handleInputChange("coverLetter", e.target.value)
                }
                className={`w-full h-64 px-4 py-3 bg-gray-700 border ${
                  validationErrors.coverLetter
                    ? "border-red-500"
                    : "border-gray-600"
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Write your cover letter or generate one with AI..."
              ></textarea>
              {validationErrors.coverLetter && (
                <p className="text-red-400 text-sm mt-1">
                  {validationErrors.coverLetter}
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                className="w-full h-24 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Any additional information you'd like to share..."
              ></textarea>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between">
              <div className="space-x-2">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white"
                >
                  <Upload className="w-4 h-4" />
                  Upload cover letter
                </button>
                <button
                  onClick={() => {
                    // Logic to download cover letter as TXT/PDF
                    const blob = new Blob([formData.coverLetter], {
                      type: "text/plain",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${job.title} - Cover Letter.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Application Questions
            </h3>
            <p className="text-gray-400 mb-6">
              Please answer the following questions to complete your application
              for {job.title} at {job.company}.
            </p>

            {/* Custom Questions from Job Listing */}
            <div className="space-y-6">
              {customQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    {question.question}{" "}
                    {question.required && (
                      <span className="text-red-400">*</span>
                    )}
                  </label>

                  {question.type === "select" && (
                    <select
                      value={formData.customQuestions[question.id] || ""}
                      onChange={(e) =>
                        handleCustomQuestionChange(question.id, e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-gray-700 border ${
                        validationErrors[`question_${question.id}`]
                          ? "border-red-500"
                          : "border-gray-600"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none`}
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
                        <label
                          key={option}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="radio"
                            checked={
                              formData.customQuestions[question.id] === option
                            }
                            onChange={() =>
                              handleCustomQuestionChange(question.id, option)
                            }
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700"
                          />
                          <span className="text-gray-300">{option}</span>
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
                      className={`w-full h-32 px-4 py-3 bg-gray-700 border ${
                        validationErrors[`question_${question.id}`]
                          ? "border-red-500"
                          : "border-gray-600"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder={question.placeholder || ""}
                    ></textarea>
                  )}

                  {validationErrors[`question_${question.id}`] && (
                    <p className="text-red-400 text-sm mt-1">
                      {validationErrors[`question_${question.id}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Review & Submit
            </h3>

            {/* Job Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="bg-purple-900 w-12 h-12 rounded-md flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">
                    {job.title}
                  </h4>
                  <p className="text-gray-400">{job.company}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-600 px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-600 px-2 py-1 rounded-full">
                      <DollarSign className="w-3 h-3" />
                      {job.salary}
                    </span>
                    {job.isRemote && (
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-900 px-2 py-1 rounded-full">
                        Remote
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Summary */}
            <div className="space-y-4">
              {/* Personal Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-white">Personal Info</h4>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>{" "}
                    <span className="text-white">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>{" "}
                    <span className="text-white">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>{" "}
                    <span className="text-white">
                      {formData.phone || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>{" "}
                    <span className="text-white">
                      {formData.location || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-white">Resume</h4>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-white">
                    {formData.resumeFile?.name || "No resume uploaded"}
                  </span>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-white">Cover Letter</h4>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-sm text-gray-300 line-clamp-3">
                  {formData.coverLetter
                    ? formData.coverLetter.substring(0, 200) +
                      (formData.coverLetter.length > 200 ? "..." : "")
                    : "No cover letter provided"}
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    handleInputChange("agreedToTerms", e.target.checked)
                  }
                  className="mt-1 text-purple-600 focus:ring-purple-500 rounded"
                />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">
                    Terms and Conditions
                  </p>
                  <p className="text-gray-300">
                    By submitting this application, I confirm that all
                    information provided is accurate and complete. I understand
                    that any false information may result in disqualification
                    from consideration.
                  </p>
                </div>
              </label>
              {validationErrors.agreedToTerms && (
                <p className="text-red-400 text-sm mt-1">
                  {validationErrors.agreedToTerms}
                </p>
              )}
            </div>

            {validationErrors.submit && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400">{validationErrors.submit}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Upgrade prompt component
  const UpgradePrompt = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Application Limit Reached
          </h3>
          <p className="text-gray-300 mb-6">
            You've reached your free application limit. Upgrade to continue
            applying to jobs.
          </p>

          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700">
              Upgrade to Premium – $19/month
            </button>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>Or</span>
            </div>
            <button className="w-full bg-gray-700 py-3 rounded-lg text-white font-medium hover:bg-gray-600">
              Buy Single Application – $4.99
            </button>
          </div>

          <button
            onClick={() => setShowUpgradePrompt(false)}
            className="mt-6 text-gray-400 hover:text-white text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl max-w-4xl w-full relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Apply to {job.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress steps */}
          <div className="px-6 pt-6">
            <div className="flex items-center mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div
                    className={`h-1 flex-grow mx-2 ${
                      index === steps.length - 1
                        ? "hidden"
                        : currentStep > step.id
                        ? "bg-purple-600"
                        : "bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`text-xs hidden md:block ${
                      currentStep >= step.id
                        ? "text-purple-400"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="p-6 max-h-[calc(80vh-150px)] overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Footer with navigation buttons */}
          <div className="p-6 border-t border-gray-700 flex justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handlePrevious}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            ) : (
              <div></div> // Empty div to maintain flex justify-between
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && <UpgradePrompt />}
    </div>
  );
}
