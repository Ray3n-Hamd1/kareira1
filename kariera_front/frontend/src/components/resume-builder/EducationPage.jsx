import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveEducation, getUserResume } from "../../services/resumeService";

// Progress Steps Component
const ProgressSteps = ({ currentStep = 3 }) => {
  const steps = [
    { id: 1, name: "Personal Info" },
    { id: 2, name: "Work History" },
    { id: 3, name: "Education" },
    { id: 4, name: "Skills" },
    { id: 5, name: "Certifications" },
    { id: 6, name: "Projects" },
    { id: 7, name: "Finalize" },
  ];

  // Calculate progress percentage based on current step
  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="mb-8">
      {/* Steps Row - All in One Big Oval Container */}
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="flex items-center justify-between flex-1 mr-6 bg-gray-800 rounded-full px-2 py-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                step.id === currentStep
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              }`}
            >
              {step.id} {step.name}
            </div>
          ))}
        </div>
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {progressPercentage}%
        </div>
      </div>

      {/* Simple Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-1">
        <div
          className="bg-purple-600 h-1 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function EducationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    educationLevel: "Bachelors",
    schoolName: "",
    schoolLocation: "",
    degree: "",
    fieldOfStudy: "",
    graduationMonth: "",
    graduationYear: "",
    currentlyStudying: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && resumeData.education) {
          setFormData(resumeData.education);
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await saveEducation(formData);
      navigate("/resume/education-additional");
    } catch (err) {
      console.error("Error saving education:", err);
      setError("Failed to save your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/resume/work-history-summary");
  };

  const handlePreview = () => {
    navigate("/resume/preview");
  };

  if (!isLoaded) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const educationLevels = [
    "High School",
    "Associates",
    "Bachelors",
    "Masters",
    "PhD",
    "Professional",
    "Other",
  ];

  const degreeTypes = [
    "Bachelor of Science (B.S.)",
    "Bachelor of Arts (B.A.)",
    "Bachelor of Engineering (B.Eng)",
    "Bachelor of Technology (B.Tech)",
    "Master of Science (M.S.)",
    "Master of Arts (M.A.)",
    "Master of Engineering (M.Eng)",
    "Master of Business Administration (MBA)",
    "Doctor of Philosophy (PhD)",
    "Other",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear + 10 - i);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-white font-semibold">Kariera</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <ProgressSteps currentStep={3} />

        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Tell us about your Education
              </h1>
              <p className="text-gray-400">
                Enter your education experience so far, even if you are
                currently a
                <br />
                student or did not graduate
              </p>
            </div>
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              1/3
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Education Level and School Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="educationLevel"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Highest education level
                </label>
                <select
                  id="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="schoolName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  School name
                </label>
                <input
                  id="schoolName"
                  type="text"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Enter school name"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* School Location and Degree */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="schoolLocation"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  School location
                </label>
                <input
                  id="schoolLocation"
                  type="text"
                  value={formData.schoolLocation}
                  onChange={handleChange}
                  placeholder="e.g Lagos, Nigeria"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="degree"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Degree
                </label>
                <select
                  id="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select</option>
                  {degreeTypes.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field of Study */}
            <div>
              <label
                htmlFor="fieldOfStudy"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Field of Study
              </label>
              <input
                id="fieldOfStudy"
                type="text"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                placeholder="e.g Architecture"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Graduation Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Graduation Date (Or Expected Graduation Date)
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <select
                  id="graduationMonth"
                  value={formData.graduationMonth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Month</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  id="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Currently Studying Checkbox */}
            <div className="flex items-center">
              <input
                id="currentlyStudying"
                type="checkbox"
                checked={formData.currentlyStudying}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600 focus:ring-2"
              />
              <label
                htmlFor="currentlyStudying"
                className="ml-2 text-sm text-gray-300"
              >
                I am currently studying here
              </label>
            </div>
          </form>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go back
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePreview}
                className="px-6 py-3 border border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
              >
                Preview
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Next"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
