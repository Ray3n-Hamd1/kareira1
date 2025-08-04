import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveAdditionalEducation,
  getUserResume,
} from "../../services/resumeService";

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

export default function AdditionalEducationPage() {
  const navigate = useNavigate();
  const [selectedSections, setSelectedSections] = useState({
    awards: true,
    academicScholarships: true,
    sportsScholarships: true,
    gpa: true,
    club: true,
  });

  const [formData, setFormData] = useState({
    // Awards
    awardName: "",
    awardYear: "",

    // Academic Scholarship
    academicScholarshipName: "",
    academicScholarshipYear: "",
    academicAwardingBody: "",

    // Sports Scholarship
    sportsScholarshipName: "",
    sportsScholarshipYear: "",
    sportsAwardingBody: "",

    // GPA
    gpaScore: "",

    // Club
    clubName: "",
    clubStartYear: "",
    clubEndYear: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && resumeData.additionalEducation) {
          setFormData(resumeData.additionalEducation);
          setSelectedSections(
            resumeData.selectedEducationSections || selectedSections
          );
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleSectionToggle = (section) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      await saveAdditionalEducation({ formData, selectedSections });
      // Show success message or update UI
    } catch (err) {
      console.error("Error saving additional education:", err);
      setError("Failed to save your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await saveAdditionalEducation({ formData, selectedSections });
      navigate("/resume/education-summary");
    } catch (err) {
      console.error("Error saving additional education:", err);
      setError("Failed to save your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/resume/education");
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

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

        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Additional educational information
              </h1>
              <p className="text-gray-400 max-w-4xl">
                Not enough work experience? this section can help you stand out,
                if your bachelor's degree is in progress, you may
                <br />
                include educational achievements or any other certification that
                corresponds to the job you want.
              </p>
            </div>
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              2/3
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Section Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Choose all that apply
              </h3>
              <div className="space-y-4">
                {[
                  { key: "awards", label: "Awards" },
                  {
                    key: "academicScholarships",
                    label: "Academic Scholarships",
                  },
                  { key: "sportsScholarships", label: "Sports Scholarships" },
                  { key: "gpa", label: "GPA" },
                  { key: "club", label: "Club" },
                ].map((section) => (
                  <label
                    key={section.key}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSections[section.key]}
                      onChange={() => handleSectionToggle(section.key)}
                      className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600 focus:ring-2"
                    />
                    <span className="text-gray-300">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Right Column - Forms */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Education Description
                </h3>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70"
                >
                  Save
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Awards Section */}
                {selectedSections.awards && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-white font-medium mb-4">Award</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        id="awardName"
                        type="text"
                        value={formData.awardName}
                        onChange={handleChange}
                        placeholder="Award name"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <input
                        id="awardYear"
                        type="text"
                        value={formData.awardYear}
                        onChange={handleChange}
                        placeholder="School year award was received"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                )}

                {/* Academic Scholarship Section */}
                {selectedSections.academicScholarships && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-white font-medium mb-4">
                      Academic scholarship
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        id="academicScholarshipName"
                        type="text"
                        value={formData.academicScholarshipName}
                        onChange={handleChange}
                        placeholder="Scholarship name"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <select
                        id="academicScholarshipYear"
                        value={formData.academicScholarshipYear}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <input
                        id="academicAwardingBody"
                        type="text"
                        value={formData.academicAwardingBody}
                        onChange={handleChange}
                        placeholder="Enter here"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2 grid grid-cols-3 gap-4">
                      <span></span>
                      <span>Year awarded</span>
                      <span>Awarding body</span>
                    </div>
                  </div>
                )}

                {/* Sports Scholarship Section */}
                {selectedSections.sportsScholarships && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-white font-medium mb-4">
                      Sports scholarship
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        id="sportsScholarshipName"
                        type="text"
                        value={formData.sportsScholarshipName}
                        onChange={handleChange}
                        placeholder="Scholarship name"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <select
                        id="sportsScholarshipYear"
                        value={formData.sportsScholarshipYear}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <input
                        id="sportsAwardingBody"
                        type="text"
                        value={formData.sportsAwardingBody}
                        onChange={handleChange}
                        placeholder="Enter here"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2 grid grid-cols-3 gap-4">
                      <span></span>
                      <span>Year awarded</span>
                      <span>Awarding body</span>
                    </div>
                  </div>
                )}

                {/* GPA Section */}
                {selectedSections.gpa && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-white font-medium mb-4">GPA</h4>
                    <div className="max-w-md">
                      <input
                        id="gpaScore"
                        type="text"
                        value={formData.gpaScore}
                        onChange={handleChange}
                        placeholder="Enter number"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                )}

                {/* Club Section */}
                {selectedSections.club && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-white font-medium mb-4">Club</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        id="clubName"
                        type="text"
                        value={formData.clubName}
                        onChange={handleChange}
                        placeholder="Club name"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <select
                        id="clubStartYear"
                        value={formData.clubStartYear}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <select
                        id="clubEndYear"
                        value={formData.clubEndYear}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 grid grid-cols-3 gap-4">
                      <span></span>
                      <span>Start year</span>
                      <span>End year</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

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
