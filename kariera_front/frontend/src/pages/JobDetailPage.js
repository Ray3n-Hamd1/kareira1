// src/pages/JobDetailPage.js - Updated with consistent salary formatting
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Users,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  Send,
  AlertCircle,
  CheckCircle,
  Globe,
  Calendar,
  Briefcase,
} from "lucide-react";
import { getJobById } from "../services/mockJobService";
import { salaryUtils } from "../utils/salaryUtils";
import { formatSalary } from "../utils/salaryUtils";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = getJobById(jobId);
        if (jobData) {
          setJob(jobData);
          setSaved(jobData.saved);
          setApplied(jobData.applied);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setApplied(true);
    } catch (error) {
      console.error("Error applying to job:", error);
    } finally {
      setApplying(false);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You might want to show a toast notification here
  };

  // Use centralized salary formatting
  const formatSalary = (salary) => {
    return salaryUtils.formatRange(salary, {
      showRange: true,
      separator: " - ",
      fallbackText: "Competitive salary",
    });
  };

  const formatPostedTime = (posted) => {
    const now = new Date();
    const postedDate = new Date(posted);
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800 rounded-lg p-8">
                  <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-gray-400 mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to jobs</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {job.company.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-xl text-gray-300 mb-4">
                      <Building2 className="w-5 h-5" />
                      <span>{job.company}</span>
                      {job.rating && (
                        <>
                          <span className="text-gray-500">•</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{job.rating}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-gray-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>{job.location}</span>
                        {job.remote && (
                          <span className="bg-green-400/10 text-green-400 px-3 py-1 rounded-full text-sm ml-2">
                            Remote
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-semibold text-green-400 text-lg">
                          {formatSalary(job.salary)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title="Share job"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    className={`p-3 rounded-lg transition-colors ${
                      saved
                        ? "text-purple-400 bg-purple-400/10"
                        : "text-gray-400 hover:text-purple-400 hover:bg-gray-700"
                    }`}
                    title={saved ? "Remove from saved" : "Save job"}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${saved ? "fill-current" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Job Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">Job Type</div>
                    <div className="font-medium text-white">{job.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm text-gray-400">Experience</div>
                    <div className="font-medium text-white">
                      {job.experienceLevel}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm text-gray-400">Posted</div>
                    <div className="font-medium text-white">
                      {formatPostedTime(job.posted)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {applied && (
                  <span className="bg-blue-400/10 text-blue-400 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Applied
                  </span>
                )}
                {job.featured && (
                  <span className="bg-purple-400/10 text-purple-400 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Featured
                  </span>
                )}
                {job.urgentHiring && (
                  <span className="bg-red-400/10 text-red-400 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Urgent Hiring
                  </span>
                )}
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                disabled={applying || applied}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 ${
                  applied
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : applying
                    ? "bg-purple-600 text-white cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {applying ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    Applying...
                  </>
                ) : applied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Applied
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Apply Now
                  </>
                )}
              </button>
            </div>

            {/* Job Description */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Job Description
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Benefits</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                About {job.company}
              </h3>
              <div className="space-y-4">
                {job.companySize && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Company Size</div>
                      <div className="text-white">{job.companySize}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Industry</div>
                    <div className="text-white">{job.industry}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Function</div>
                    <div className="text-white">{job.jobFunction}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Job Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Applications</span>
                  <span className="text-white font-medium">
                    {job.applicationCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Posted</span>
                  <span className="text-white font-medium">
                    {formatPostedTime(job.posted)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Job ID</span>
                  <span className="text-white font-medium font-mono text-sm">
                    {job.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Jobs CTA */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                More Opportunities
              </h3>
              <p className="text-gray-400 mb-4">
                Discover similar {job.experienceLevel.toLowerCase()} level
                positions at {job.company} and other companies.
              </p>
              <button
                onClick={() => navigate(`/jobs?company=${job.company}`)}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Similar Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
