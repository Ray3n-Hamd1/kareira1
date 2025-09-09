// src/components/RealJobsDashboard.js - Jobs Dashboard with Real API Integration
import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  ExternalLink,
  Bookmark,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  RefreshCw,
} from "lucide-react";
import { useJobsApi } from "../hooks/useJobsApi";
import { useAuth } from "../context/AuthContext";

const RealJobsDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    jobs,
    loading,
    error,
    totalCount,
    getJobRecommendations,
    clearError,
  } = useJobsApi();

  // Local state for file upload and settings
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadOptions, setUploadOptions] = useState({
    country: "usa",
    jobTitle: "internship",
    numberOfJobs: 10,
  });
  const [savedJobs, setSavedJobs] = useState(new Set());
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      clearError(); // Clear any previous errors
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      clearError();
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Submit resume for job recommendations
  const handleGetRecommendations = async () => {
    if (!selectedFile) {
      return;
    }

    const result = await getJobRecommendations(selectedFile, uploadOptions);

    if (result.success) {
      console.log(`Found ${result.jobs.length} job recommendations`);
    }
  };

  // Handle job save/unsave
  const handleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // Format job data for display
  const formatJob = (job, index) => ({
    id: job.id || index,
    title: job.jobTitle || job.title,
    company: job.company || "Company not specified",
    location: job.location || "Location not specified",
    description: job.description || "No description available",
    link: job.link || job.jobUrl || "#",
    type: job.type || "Full-time",
    salary: job.salary || "Salary not specified",
    postedDate: job.postedDate || "Recently posted",
    skills: job.skills || [],
    isRemote: job.isRemote || false,
  });

  // Job Card Component
  const JobCard = ({ job }) => {
    const isSaved = savedJobs.has(job.id);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {job.title}
            </h3>
            <p className="text-gray-600 mb-2">{job.company}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
          </div>
          <button
            onClick={() => handleSaveJob(job.id)}
            className={`p-2 rounded-full transition-colors ${
              isSaved
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {job.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {job.postedDate}
          </div>

          {job.link && job.link !== "#" && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Now
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    );
  };

  // File Upload Area Component
  const FileUploadArea = () => (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        selectedFile
          ? "border-green-300 bg-green-50"
          : "border-gray-300 bg-gray-50 hover:border-gray-400"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedFile ? (
        <div className="space-y-2">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <p className="text-lg font-medium text-green-700">
            {selectedFile.name}
          </p>
          <p className="text-sm text-green-600">
            Ready to get job recommendations
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Choose different file
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-lg font-medium text-gray-700">
            Upload your resume
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop your PDF resume here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose File
          </button>
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Recommendations
          </h1>
          <p className="text-gray-600">
            Upload your resume to get personalized job recommendations powered
            by AI
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* File Upload */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
              <FileUploadArea />
            </div>

            {/* Options */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Search Options</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    value={uploadOptions.country}
                    onChange={(e) =>
                      setUploadOptions({
                        ...uploadOptions,
                        country: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="usa">United States</option>
                    <option value="canada">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select
                    value={uploadOptions.jobTitle}
                    onChange={(e) =>
                      setUploadOptions({
                        ...uploadOptions,
                        jobTitle: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="internship">Internship</option>
                    <option value="entry-level">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid-level">Mid Level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Jobs
                  </label>
                  <select
                    value={uploadOptions.numberOfJobs}
                    onChange={(e) =>
                      setUploadOptions({
                        ...uploadOptions,
                        numberOfJobs: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value={5}>5 jobs</option>
                    <option value={10}>10 jobs</option>
                    <option value={15}>15 jobs</option>
                    <option value={20}>20 jobs</option>
                  </select>
                </div>

                <button
                  onClick={handleGetRecommendations}
                  disabled={!selectedFile || loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {(jobs.length > 0 || loading) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {loading
                  ? "Finding Jobs..."
                  : `Job Recommendations (${totalCount})`}
              </h2>
              {jobs.length > 0 && (
                <div className="text-sm text-gray-500">
                  {savedJobs.size} saved
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-lg p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4 w-1/2"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, index) => (
                  <JobCard key={job.id || index} job={formatJob(job, index)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && !error && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No job recommendations yet
            </h3>
            <p className="text-gray-500">
              Upload your resume to get started with personalized job
              recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealJobsDashboard;
