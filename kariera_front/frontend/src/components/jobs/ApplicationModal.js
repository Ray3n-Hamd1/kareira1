// src/components/jobs/ApplicationModal.js - Enhanced application modal
import React, { useState, useEffect } from "react";
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
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Resume, 3: Cover Letter, 4: Review
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(" ")[0] || "",
    lastName: user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.city || "",
    resumeFile: null,
    coverLetter: "",
    additionalNotes: "",
    portfolioUrl: "",
    linkedinUrl: "",
    availableStartDate: "",
    expectedSalary: "",
  });

  const [coverLetterGenerated, setCoverLetterGenerated] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetterCustomized, setCoverLetterCustomized] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      handleInputChange("resumeFile", file);
    } else {
      alert("Please upload a PDF file");
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
      }. With my background in ${job.skills
        .slice(0, 2)
        .join(
          " and "
        )}, I am confident I can contribute effectively to your team.

In my previous experience, I have developed strong skills in ${job.skills.join(
        ", "
      )} and have worked on projects that align closely with your requirements. I am particularly drawn to ${
        job.company
      }'s mission and would love the opportunity to contribute to your innovative team.

Key highlights of my qualifications include:
• Proficiency in ${job.skills.slice(0, 3).join(", ")}
• ${job.experienceLevel} level experience in software development
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
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
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
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return formData.resumeFile;
      case 3:
        return formData.coverLetter;
      case 4:
        return true;
      default:
        return false;
    }
  };

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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
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
                  placeholder="City, State"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Resume Upload
            </h3>

            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
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
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

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
                  placeholder="e.g., $80,000 - $100,000"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
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
                onChange={(e) => {
                  handleInputChange("coverLetter", e.target.value);
                  setCoverLetterCustomized(true);
                }}
                placeholder="Write your cover letter here, or generate one using AI..."
                rows={12}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">
                  {formData.coverLetter.length} characters
                </span>
                {coverLetterCustomized && (
                  <span className="text-sm text-blue-400">✓ Customized</span>
                )}
              </div>
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
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Review Application
            </h3>

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
                <h4 className="font-medium text-white mb-2">Resume</h4>
                <div className="text-sm text-gray-300">
                  {formData.resumeFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{formData.resumeFile.name}</span>
                    </div>
                  ) : (
                    <span className="text-red-400">No resume uploaded</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">Cover Letter</h4>
                <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded max-h-32 overflow-y-auto">
                  {formData.coverLetter || "No cover letter provided"}
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">
                    Ready to Submit
                  </h4>
                  <p className="text-sm text-gray-300">
                    By submitting this application, you confirm that all
                    information is accurate and you're interested in the{" "}
                    {job.title} position at {job.company}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-white">
                Apply to {job.company}
              </h2>
              <p className="text-gray-400">{job.title}</p>
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
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step < currentStep
                        ? "bg-green-600 text-white"
                        : step === currentStep
                        ? "bg-purple-600 text-white"
                        : isStepComplete(step)
                        ? "bg-green-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {step < currentStep || isStepComplete(step) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-12 h-0.5 ${
                        step < currentStep ? "bg-green-600" : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Personal Info</span>
              <span>Resume</span>
              <span>Cover Letter</span>
              <span>Review</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentStep === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStepComplete(4)}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
                  disabled={!isStepComplete(currentStep)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
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
