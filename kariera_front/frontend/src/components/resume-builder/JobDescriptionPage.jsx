import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveJobDescription, getUserResume } from "./services/resumeService";

// Progress Steps Component
const ProgressSteps = ({ currentStep = 2 }) => {
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

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const handleFormat = (command) => {
    document.execCommand(command, false, null);

    // Update button states
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
  };

  const handleBulletList = () => {
    document.execCommand("insertUnorderedList", false, null);
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg">
      <div
        contentEditable
        className="min-h-[200px] p-4 text-white focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.target.innerHTML)}
        style={{ whiteSpace: "pre-wrap" }}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-600">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleFormat("bold")}
            className={`p-2 rounded ${
              isBold
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => handleFormat("italic")}
            className={`p-2 rounded ${
              isItalic
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => handleFormat("underline")}
            className={`p-2 rounded ${
              isUnderline
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={handleBulletList}
            className="p-2 text-gray-400 hover:text-white rounded"
          >
            ☰
          </button>
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-sm font-bold">
            Aa
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-white rounded"
          >
            ↶
          </button>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-white rounded"
          >
            ↷
          </button>
        </div>
      </div>
    </div>
  );
};

export default function JobDescriptionPage() {
  const navigate = useNavigate();
  const [jobInfo, setJobInfo] = useState({
    jobTitle: "UI/UX Designer",
    company: "Grey Finance",
    location: "Lagos, Nigeria",
    workMode: "Remote",
    startDate: "September 2023",
    endDate: "August 2024",
  });
  const [jobDescription, setJobDescription] = useState(`
    <ul>
      <li>• Worked closely with marketing teams to align branding elements within the UI/UX design.</li>
      <li>• Developed interactive mockups using prototyping tools such as Sketch or Adobe XD for validation purposes before implementation phases began.</li>
      <li>• Created style guides and design systems to maintain consistency across all platforms and products.</li>
    </ul>
  `);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && resumeData.workHistory) {
          setJobInfo(resumeData.workHistory);
        }
        if (resumeData && resumeData.jobDescription) {
          setJobDescription(resumeData.jobDescription);
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await saveJobDescription(jobDescription);
      navigate("/resume/work-history-summary");
    } catch (err) {
      console.error("Error saving job description:", err);
      setError("Failed to save your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/resume/work-history");
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
        <ProgressSteps currentStep={2} />

        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Describe what you did
              </h1>
              <p className="text-gray-400">Describe your role in the job.</p>
            </div>
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              2/3
            </div>
          </div>

          {/* Job Info Display */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-2">
              <h2 className="text-xl font-semibold text-white">
                {jobInfo.jobTitle}
              </h2>
              <span className="text-gray-400">|</span>
              <h3 className="text-xl text-white">{jobInfo.company}</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {jobInfo.location} ({jobInfo.workMode}) - {jobInfo.startDate} -{" "}
              {jobInfo.endDate}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Description Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Job Description
              </h3>
              <RichTextEditor
                value={jobDescription}
                onChange={setJobDescription}
              />
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
