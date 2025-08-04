import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveSoftwareSkills, getUserResume } from "../../services/resumeService";

// Progress Steps Component
const ProgressSteps = ({ currentStep = 7 }) => {
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

// Software Skill Input Component
const SoftwareSkillInput = ({ skill, index, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center space-x-3">
      <input
        type="text"
        value={skill}
        onChange={(e) => onUpdate(index, e.target.value)}
        placeholder={
          index === 0 ? "Figma" : index === 1 ? "Sketch" : "Enter software"
        }
        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-3 text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default function SoftwareSkillsPage() {
  const navigate = useNavigate();
  const [softwareSkills, setSoftwareSkills] = useState([
    "Figma",
    "Sketch",
    "Adobe XD",
    "Blender",
    "Spline",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && resumeData.softwareSkills) {
          setSoftwareSkills(resumeData.softwareSkills);
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleUpdateSkill = (index, value) => {
    setSoftwareSkills((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleRemoveSkill = (index) => {
    setSoftwareSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    setSoftwareSkills((prev) => [...prev, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Filter out empty skills
    const validSkills = softwareSkills.filter((skill) => skill.trim() !== "");

    try {
      await saveSoftwareSkills(validSkills);
      navigate("/resume/interests-hobbies");
    } catch (err) {
      console.error("Error saving software skills:", err);
      setError("Failed to save your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/resume/background-summary");
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
        <ProgressSteps currentStep={7} />

        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">
                What Software skills do you have?
              </h1>
              <p className="text-gray-400 mb-2">
                List the software tools and programs you're proficient in, from
                productivity suites
                <br />
                to specialized software relevant to your field.
              </p>
              <p className="text-gray-300 text-sm">
                We recommend 6 to 12 skills
              </p>
            </div>
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              3/4
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Software Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {softwareSkills.map((skill, index) => (
                <SoftwareSkillInput
                  key={index}
                  skill={skill}
                  index={index}
                  onUpdate={handleUpdateSkill}
                  onRemove={handleRemoveSkill}
                />
              ))}
            </div>

            {/* Add Another Skill Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleAddSkill}
                className="border-2 border-dashed border-gray-600 rounded-lg py-4 px-6 text-center hover:border-purple-500 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-purple-400 text-lg">+</span>
                  <span className="text-purple-400 font-medium">
                    Add another skill
                  </span>
                </div>
              </button>
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
