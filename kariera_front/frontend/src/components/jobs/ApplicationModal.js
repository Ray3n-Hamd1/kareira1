// src/components/jobs/ApplicationModal.js - Enhanced with complete flow
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
  Camera,
  Paperclip,
  Globe,
  Calendar,
  DollarSign,
  Clock,
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
      } and have worked on projects that align closely with your requirements. I am particularly drawn to ${
        job.company
      }'s mission and would love the opportunity to contribute to your innovative team.

Key highlights of my qualifications include:
• Proficiency in ${
        job.skills?.slice(0, 3).join(", ") || "relevant technologies"
      }
• ${job.experienceLevel || "Mid"} level experience in software development
• Strong problem-solving and collaboration skills
• Passion for ${job.company.toLowerCase()} technologies and innovation

I am excited about the opportunity to discuss how my skills and experience can benefit ${
        job.company
      }. Thank you for considering my application.

Best regards,
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
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
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.firstName
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                  placeholder="Enter your first name"
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
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.lastName
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                  placeholder="Enter your last name"
                />
                {validationErrors.lastName && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.email ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter your email address"
              />
              {validationErrors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="https://linkedin.com/in/yourprofile"
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
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Choose File
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              {validationErrors.resumeFile && (
                <p className="text-red-400 text-sm mt-1">
                  {validationErrors.resumeFile}
                </p>
              )}
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Start Date
                </label>
                <input
                  type="date"
                  value={formData.availableStartDate}
                  onChange={(e) =>
                    handleInputChange("availableStartDate", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Salary
                </label>
                <input
                  type="text"
                  value={formData.expectedSalary}
                  onChange={(e) =>
                    handleInputChange("expectedSalary", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., $80,000 - $100,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notice Period
                </label>
                <select
                  value={formData.noticePeriod}
                  onChange={(e) =>
                    handleInputChange("noticePeriod", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select notice period</option>
                  <option value="immediate">Immediate</option>
                  <option value="2-weeks">2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="2-months">2 months</option>
                  <option value="3-months">3 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Work Authorization
                </label>
                <select
                  value={formData.workAuthorization}
                  onChange={(e) =>
                    handleInputChange("workAuthorization", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select authorization status</option>
                  <option value="citizen">US Citizen</option>
                  <option value="permanent-resident">Permanent Resident</option>
                  <option value="work-visa">Work Visa</option>
                  <option value="student-visa">Student Visa (OPT/CPT)</option>
                  <option value="sponsor-required">Requires Sponsorship</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Cover Letter</h3>
              {!coverLetterGenerated && (
                <button
                  onClick={generateCoverLetter}
                  disabled={isGeneratingCoverLetter}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isGeneratingCoverLetter ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </>
                  )}
                </button>
              )}
            </div>

            {coverLetterGenerated && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    AI Cover Letter Generated!
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  Your personalized cover letter has been created. Feel free to
                  customize it further.
                </p>
              </div>
            )}

            <div>
              <textarea
                value={formData.coverLetter}
                onChange={(e) =>
                  handleInputChange("coverLetter", e.target.value)
                }
                placeholder="Write your cover letter here, or generate one using AI..."
                rows={15}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                  validationErrors.coverLetter
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">
                  {formData.coverLetter.length} characters
                </span>
                {coverLetterGenerated && (
                  <span className="text-sm text-blue-400">✓ AI Generated</span>
                )}
              </div>
              {validationErrors.coverLetter && (
                <p className="text-red-400 text-sm mt-1">
                  {validationErrors.coverLetter}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                placeholder="Any additional information you'd like to share..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Additional Questions
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              Please answer these questions to help us understand your fit for
              this role.
            </p>

            {customQuestions.map((question) => (
              <div key={question.id} className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  {question.question}
                  {question.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </label>

                {question.type === "select" && (
                  <select
                    value={formData.customQuestions[question.id] || ""}
                    onChange={(e) =>
                      handleCustomQuestionChange(question.id, e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      validationErrors[`question_${question.id}`]
                        ? "border-red-500"
                        : "border-gray-600"
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
                      <label key={option} className="flex items-center gap-2">
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
                          className="text-purple-600 focus:ring-purple-500"
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
                    placeholder={question.placeholder}
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      validationErrors[`question_${question.id}`]
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                  />
                )}

                {validationErrors[`question_${question.id}`] && (
                  <p className="text-red-400 text-sm">
                    {validationErrors[`question_${question.id}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Review & Submit Application
            </h3>

            {/* Application Summary */}
            <div className="bg-gray-700 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">
                  Personal Information
                </h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>{formData.email}</p>
                  {formData.phone && <p>{formData.phone}</p>}
                  {formData.location && <p>{formData.location}</p>}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">
                  Resume & Details
                </h4>
                <div className="text-sm text-gray-300">
                  {formData.resumeFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{formData.resumeFile.name}</span>
                    </div>
                  ) : (
                    <span className="text-red-400">No resume uploaded</span>
                  )}
                  {formData.expectedSalary && (
                    <p>Expected Salary: {formData.expectedSalary}</p>
                  )}
                  {formData.availableStartDate && (
                    <p>Available: {formData.availableStartDate}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">Cover Letter</h4>
                <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded max-h-32 overflow-y-auto">
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
                <p className="text-red-400 text-sm mt-2">
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

          <div className="space-y-3">
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium">
              Upgrade to Premium - $19/month
            </button>
            <button
              onClick={() => setShowUpgradePrompt(false)}
              className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {job.company.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Apply to {job.company}
                </h2>
                <p className="text-gray-400">{job.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step.id < currentStep
                          ? "bg-green-600 text-white"
                          : step.id === currentStep
                          ? "bg-purple-600 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 text-center">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        step.id < currentStep ? "bg-green-600" : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentStep === 5 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Prompt */}
      {showUpgradePrompt && <UpgradePrompt />}
    </>
  );
}
