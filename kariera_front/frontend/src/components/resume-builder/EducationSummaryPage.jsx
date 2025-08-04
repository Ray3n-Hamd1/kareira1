import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserResume, deleteEducation } from "./services/resumeService";

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

// Education Card Component
const EducationCard = ({ education, index, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatGraduation = (month, year, currentlyStudying) => {
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

    if (currentlyStudying) {
      return "Currently studying";
    }

    return `Graduated in ${months[month - 1]} ${year}`;
  };

  const renderAchievements = (additionalInfo) => {
    const achievements = [];

    if (additionalInfo.awardName && additionalInfo.awardYear) {
      achievements.push(
        `Won the ${additionalInfo.awardName} in ${additionalInfo.awardYear}`
      );
    }

    if (
      additionalInfo.academicScholarshipName &&
      additionalInfo.academicScholarshipYear
    ) {
      achievements.push(
        `Was given a Academic scholarship by ${additionalInfo.academicAwardingBody} in ${additionalInfo.academicScholarshipYear}`
      );
    }

    if (
      additionalInfo.sportsScholarshipName &&
      additionalInfo.sportsScholarshipYear
    ) {
      achievements.push(
        `Was given a Sports scholarship by ${additionalInfo.sportsAwardingBody} in ${additionalInfo.sportsScholarshipYear}`
      );
    }

    if (
      additionalInfo.clubName &&
      additionalInfo.clubStartYear &&
      additionalInfo.clubEndYear
    ) {
      achievements.push(
        `Was in the ${additionalInfo.clubName} from ${additionalInfo.clubStartYear} to ${additionalInfo.clubEndYear}`
      );
    }

    if (additionalInfo.gpaScore) {
      achievements.push(`GPA: ${additionalInfo.gpaScore}`);
    }

    return achievements;
  };

  const achievements = renderAchievements(education.additionalInfo || {});

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Number Circle */}
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {index + 1}
          </div>

          <div className="flex-1">
            {/* Education Title */}
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-white">
                {education.degree} - {education.schoolName}
              </h3>
              <span className="text-gray-400">|</span>
              <span className="text-lg text-white">
                {education.fieldOfStudy}
              </span>
            </div>

            {/* Location and Date */}
            <p className="text-gray-400 text-sm mb-4">
              {education.schoolLocation} |{" "}
              {formatGraduation(
                education.graduationMonth,
                education.graduationYear,
                education.currentlyStudying
              )}
            </p>

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="text-gray-300 text-sm space-y-1 mb-4">
                {achievements
                  .slice(0, showDetails ? achievements.length : 4)
                  .map((achievement, idx) => (
                    <p key={idx}>{achievement}</p>
                  ))}
              </div>
            )}

            {/* Show more details toggle */}
            {achievements.length > 4 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1 mb-2"
              >
                <span>{showDetails ? "▼" : "▶"}</span>
                <span>Show more details</span>
              </button>
            )}
          </div>
        </div>

        {/* Edit and Delete Icons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(education.id)}
            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(education.id)}
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

export default function EducationSummaryPage() {
  const navigate = useNavigate();
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Sample data - in real app this would come from API
  const sampleEducation = {
    id: 1,
    educationLevel: "Bachelors",
    schoolName: "University of Ibadan",
    schoolLocation: "Ibadan, Nigeria",
    degree: "Bachelor of science",
    fieldOfStudy: "Architecture",
    graduationMonth: 11,
    graduationYear: 2023,
    currentlyStudying: false,
    additionalInfo: {
      awardName: "greg award in my 3rd year in school",
      awardYear: "2022",
      academicScholarshipName: "Academic scholarship",
      academicScholarshipYear: "2023",
      academicAwardingBody: "MTN",
      sportsScholarshipName: "Sports scholarship",
      sportsScholarshipYear: "2022",
      sportsAwardingBody: "NFL",
      clubName: "chess club",
      clubStartYear: "2021",
      clubEndYear: "2023",
      gpaScore: "",
    },
  };

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && resumeData.educations) {
          setEducations(resumeData.educations);
        } else {
          // Set sample data for demo
          setEducations([sampleEducation]);
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setEducations([sampleEducation]);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleEdit = (educationId) => {
    navigate(`/resume/education/edit/${educationId}`);
  };

  const handleDelete = async (educationId) => {
    if (
      window.confirm("Are you sure you want to delete this education entry?")
    ) {
      try {
        await deleteEducation(educationId);
        setEducations((prev) => prev.filter((edu) => edu.id !== educationId));
      } catch (err) {
        console.error("Error deleting education:", err);
        setError("Failed to delete education entry. Please try again.");
      }
    }
  };

  const handleAddDegree = () => {
    navigate("/resume/education/add");
  };

  const handleNext = () => {
    navigate("/resume/skills");
  };

  const handleGoBack = () => {
    navigate("/resume/education-additional");
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
        <ProgressSteps currentStep={3} />

        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Education summary
              </h1>
              <p className="text-gray-400 max-w-3xl">
                An overview of your academic background, including degrees
                earned, institutions attended,
                <br />
                and notable achievements. This summary highlights your
                educational qualifications and areas of expertise.
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

          {/* Education Entries */}
          <div className="space-y-6 mb-8">
            {educations.map((education, index) => (
              <EducationCard
                key={education.id}
                education={education}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Add Another Degree Button */}
          <div className="mb-12">
            <button
              onClick={handleAddDegree}
              className="w-full border-2 border-dashed border-gray-600 rounded-lg py-8 text-center hover:border-purple-500 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-purple-400 text-xl">+</span>
                <span className="text-purple-400 font-medium">
                  Add another degree
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
