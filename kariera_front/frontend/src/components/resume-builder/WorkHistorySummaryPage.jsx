import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserResume, deleteWorkExperience } from "./services/resumeService";

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

// Work Experience Card Component
const WorkExperienceCard = ({
  experience,
  index,
  onEdit,
  onDelete,
  onEditDescription,
  onShowDetails,
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

  const formatDateRange = (
    startMonth,
    startYear,
    endMonth,
    endYear,
    currentlyWorking
  ) => {
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

    const startDate = `${months[startMonth - 1]} ${startYear}`;
    const endDate = currentlyWorking
      ? "Present"
      : `${months[endMonth - 1]} ${endYear}`;

    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Number Circle */}
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {index + 1}
          </div>

          <div className="flex-1">
            {/* Job Title and Company */}
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-white">
                {experience.jobTitle}, {experience.employer}
              </h3>
            </div>

            {/* Location and Date */}
            <p className="text-gray-400 text-sm mb-4">
              {experience.location} ({experience.workMode}) -{" "}
              {formatDateRange(
                experience.startMonth,
                experience.startYear,
                experience.endMonth,
                experience.endYear,
                experience.currentlyWorking
              )}
            </p>

            {/* Job Description */}
            <div className="text-gray-300 text-sm space-y-2 mb-4">
              <div
                dangerouslySetInnerHTML={{ __html: experience.description }}
              />
            </div>

            {/* Action Links */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onEditDescription(experience.id)}
                className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1"
              >
                <span>✏️</span>
                <span>Edit description</span>
              </button>
              <button
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1"
              >
                <span>{showFullDetails ? "▼" : "▶"}</span>
                <span>Show more details</span>
              </button>
            </div>
          </div>
        </div>

        {/* Edit and Delete Icons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(experience.id)}
            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(experience.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WorkHistorySummaryPage() {
  const navigate = useNavigate();
  const [workExperiences, setWorkExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Sample data - in real app this would come from API
  const sampleExperience = {
    id: 1,
    jobTitle: "UI/UX Designer",
    employer: "Grey Finance",
    location: "Lagos, Nigeria",
    workMode: "Remote",
    startMonth: 9,
    startYear: 2023,
    endMonth: 8,
    endYear: 2024,
    currentlyWorking: false,
    description: `
      <ul>
        <li>Worked closely with marketing teams to align branding elements within the UI/UX design.</li>
        <li>Developed interactive mockups using prototyping tools such as Sketch or Adobe XD for validation purposes before implementation phases began.</li>
        <li>Created style guides and design systems to maintain consistency across all platforms and products.</li>
      </ul>
    `,
  };

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && resumeData.workExperiences) {
          setWorkExperiences(resumeData.workExperiences);
        } else {
          // Set sample data for demo
          setWorkExperiences([sampleExperience]);
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setWorkExperiences([sampleExperience]);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleEdit = (experienceId) => {
    navigate(`/resume/work-history/edit/${experienceId}`);
  };

  const handleDelete = async (experienceId) => {
    if (
      window.confirm("Are you sure you want to delete this work experience?")
    ) {
      try {
        await deleteWorkExperience(experienceId);
        setWorkExperiences((prev) =>
          prev.filter((exp) => exp.id !== experienceId)
        );
      } catch (err) {
        console.error("Error deleting work experience:", err);
        setError("Failed to delete work experience. Please try again.");
      }
    }
  };

  const handleEditDescription = (experienceId) => {
    navigate(`/resume/job-description/edit/${experienceId}`);
  };

  const handleAddPosition = () => {
    navigate("/resume/work-history/add");
  };

  const handleNext = () => {
    navigate("/resume/education");
  };

  const handleGoBack = () => {
    navigate("/resume/job-description");
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
                Work history summary
              </h1>
              <p className="text-gray-400 max-w-3xl">
                A brief overview of your past roles, key achievements, and
                skills gained.
                <br />
                This summary highlights your career progression and impact in
                previous positions.
              </p>
            </div>
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              3/3
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Work Experiences */}
          <div className="space-y-6 mb-8">
            {workExperiences.map((experience, index) => (
              <WorkExperienceCard
                key={experience.id}
                experience={experience}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onEditDescription={handleEditDescription}
              />
            ))}
          </div>

          {/* Add Position Button */}
          <div className="mb-12">
            <button
              onClick={handleAddPosition}
              className="w-full border-2 border-dashed border-gray-600 rounded-lg py-8 text-center hover:border-purple-500 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-purple-400 text-xl">+</span>
                <span className="text-purple-400 font-medium">
                  Add position
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
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
                type="button"
                onClick={handleNext}
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
