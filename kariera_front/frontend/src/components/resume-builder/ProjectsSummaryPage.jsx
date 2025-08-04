import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserResume, deleteProject } from "./services/resumeService";

// Progress Steps Component
const ProgressSteps = ({ currentStep = 6 }) => {
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

// Project Card Component
const ProjectCard = ({ project, index, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Number Circle */}
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {index + 1}
          </div>

          <div className="flex-1">
            {/* Project Title and Type */}
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-white">
                {project.projectTitle}
              </h3>
              <span className="text-gray-400">|</span>
              <span className="text-lg text-white">{project.projectType}</span>
            </div>

            {/* Project Link */}
            {project.projectLink && (
              <div className="mb-4">
                <span className="text-gray-400 text-sm">Project link: </span>
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 text-sm hover:text-purple-300 underline"
                >
                  {project.projectLink}
                </a>
              </div>
            )}

            {/* Project Description */}
            <div className="text-gray-300 text-sm mb-4">
              <div
                dangerouslySetInnerHTML={{ __html: project.projectDescription }}
                className={showDetails ? "" : "line-clamp-3"}
              />
            </div>

            {/* Show more details toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1 mb-2"
            >
              <span>{showDetails ? "▼" : "▶"}</span>
              <span>Show more details</span>
            </button>
          </div>
        </div>

        {/* Edit and Delete Icons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(project.id)}
            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(project.id)}
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

export default function ProjectsSummaryPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Sample data - in real app this would come from API
  const sampleProject = {
    id: 1,
    projectTitle: "Fitness App",
    projectType: "Freelance",
    projectLink: "github.stlferankolin-ommniyu-jegels",
    projectDescription: `
      A fitness app helps users track workouts, set goals, monitor progress, and stay motivated with personalized fitness plans. It often includes features like workout routines, calorie tracking, activity logs, and integrates with wearables for a complete fitness experience. Users can follow guided exercises, receive performance insights, and stay connected with a community for encouragement and accountability.
    `,
  };

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && resumeData.projects) {
          setProjects(resumeData.projects);
        } else {
          // Set sample data for demo
          setProjects([sampleProject]);
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setProjects([sampleProject]);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleEdit = (projectId) => {
    navigate(`/resume/projects/edit/${projectId}`);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId);
        setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
      } catch (err) {
        console.error("Error deleting project:", err);
        setError("Failed to delete project. Please try again.");
      }
    }
  };

  const handleAddProject = () => {
    navigate("/resume/projects/add");
  };

  const handleNext = () => {
    navigate("/resume/finalize");
  };

  const handleGoBack = () => {
    navigate("/resume/projects");
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
        <ProgressSteps currentStep={6} />

        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Tell us about Projects you've worked on
              </h1>
              <p className="text-gray-400">
                You can include any personal projects, contract, volunteer or
                freelance projects
              </p>
            </div>
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              2/2
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Projects */}
          <div className="space-y-6 mb-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Add Another Project Button */}
          <div className="mb-12">
            <button
              onClick={handleAddProject}
              className="w-full border-2 border-dashed border-gray-600 rounded-lg py-8 text-center hover:border-purple-500 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-purple-400 text-xl">+</span>
                <span className="text-purple-400 font-medium">
                  Add another Project
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
