// src/pages/JobDetailPage.js - Fixed version with correct imports
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Building2,
  BookmarkIcon,
  Send,
  Share2,
  ExternalLink,
  CheckCircle,
  Star,
  Globe,
  Calendar,
  Trophy,
  Heart,
  ChevronRight,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getJobById, generateMockJobs } from "../services/mockJobService";
// FIXED: Import specific functions instead of default export
import { formatSalary, getSalaryAverage } from "../utils/salaryUtils";
import ApplicationModal from "../components/jobs/ApplicationModal";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // description, company, reviews

  // Load job details
  useEffect(() => {
    const loadJobDetails = async () => {
      setLoading(true);
      try {
        console.log("Loading job with ID:", id); // Debug log

        // Get the specific job by ID using the fixed service
        const foundJob = getJobById(id);

        if (!foundJob) {
          console.log("Job not found, redirecting to jobs list");
          navigate("/jobs");
          return;
        }

        console.log("Found job:", foundJob); // Debug log

        // Enhance job with additional details for PDP
        const enhancedJob = {
          ...foundJob,
          fullDescription: `
<h3>About This Role</h3>
<p>We're looking for a ${foundJob.title} to join our ${
            foundJob.company
          } team. This is an exciting opportunity to work on cutting-edge technology that impacts millions of users worldwide.</p>

<h3>What You'll Do</h3>
<ul>
<li>Design and develop scalable software solutions</li>
<li>Collaborate with cross-functional teams to deliver high-quality products</li>
<li>Participate in code reviews and maintain coding standards</li>
<li>Troubleshoot and debug applications</li>
<li>Stay up-to-date with emerging technologies and best practices</li>
</ul>

<h3>What We're Looking For</h3>
<ul>
<li>${
            foundJob.experienceLevel === "Entry"
              ? "0-2"
              : foundJob.experienceLevel === "Mid"
              ? "2-5"
              : "5+"
          } years of experience in software development</li>
<li>Strong proficiency in ${
            foundJob.skills?.slice(0, 2).join(" and ") ||
            "relevant technologies"
          }</li>
<li>Experience with ${
            foundJob.skills?.slice(2).join(", ") || "modern development tools"
          }</li>
<li>Bachelor's degree in Computer Science or related field</li>
<li>Excellent problem-solving and communication skills</li>
</ul>

<h3>Nice to Have</h3>
<ul>
<li>Experience with cloud platforms (AWS, GCP, Azure)</li>
<li>Knowledge of containerization technologies (Docker, Kubernetes)</li>
<li>Understanding of CI/CD pipelines</li>
<li>Open source contributions</li>
</ul>
          `,
          companyInfo: {
            description: `${foundJob.company} is a leading technology company that's revolutionizing how people connect and interact with technology.`,
            size: "1000-5000 employees",
            founded: "2010",
            industry: "Technology",
            headquarters: foundJob.location,
            website: `https://${foundJob.company
              .toLowerCase()
              .replace(/\s+/g, "")}.com`,
          },
          benefits: [
            "Competitive salary and equity",
            "Comprehensive health coverage",
            "Flexible work arrangements",
            "Professional development budget",
            "Unlimited PTO",
            "Modern office space",
            "Team building events",
            "Gym membership",
          ],
          requirements: [
            `${
              foundJob.experienceLevel === "Entry"
                ? "0-2"
                : foundJob.experienceLevel === "Mid"
                ? "2-5"
                : "5+"
            } years of experience`,
            "Bachelor's degree or equivalent",
            "Strong communication skills",
            "Team player mentality",
            "Problem-solving abilities",
          ],
        };

        setJob(enhancedJob);

        // Generate similar jobs
        const allJobs = generateMockJobs(50);
        const similar = allJobs
          .filter(
            (j) =>
              j.id !== foundJob.id &&
              (j.title.includes(foundJob.title.split(" ")[0]) ||
                j.company === foundJob.company ||
                j.location === foundJob.location)
          )
          .slice(0, 6);

        setSimilarJobs(similar);
      } catch (error) {
        console.error("Error loading job details:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadJobDetails();
    }
  }, [id, navigate]);

  const handleSaveJob = () => {
    setSaved(!saved);
    // Add API call to save/unsave job
  };

  const handleApplyClick = () => {
    if (applied) {
      // Already applied, maybe show application status
      return;
    }
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      // API call to submit application
      console.log("Submitting application:", applicationData);
      setApplied(true);
      setShowApplicationModal(false);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-xl">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-gray-400 mb-4">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/jobs"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Jobs</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSaveJob}
              className={`p-2 rounded-lg transition-colors ${
                saved
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {job.company}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Posted {Math.floor(Math.random() * 7) + 1} days ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {job.salary ? formatSalary(job.salary) : "Competitive"}
                  </div>
                  <div className="text-sm text-gray-400">per year</div>
                </div>
              </div>

              {/* Job Meta */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">{job.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">{job.experienceLevel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">
                    {job.remote ? "Remote" : "On-site"}
                  </span>
                </div>
                {job.urgentHiring && (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400">
                      Urgent Hiring
                    </span>
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyClick}
                disabled={applied}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  applied
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {applied ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Applied
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Apply Now
                  </span>
                )}
              </button>
            </div>

            {/* Job Details Tabs */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                {[
                  { id: "description", label: "Job Description" },
                  { id: "company", label: "Company" },
                  { id: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-purple-400 border-b-2 border-purple-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "description" && (
                  <div className="prose prose-invert max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: job.fullDescription,
                      }}
                    />

                    {/* Requirements */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">
                        Benefits & Perks
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-2" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "company" && (
                  <div>
                    <div className="flex items-start space-x-6 mb-6">
                      <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {job.company}
                        </h2>
                        <p className="text-gray-400 mb-4">
                          {job.companyInfo.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Industry:</span>
                            <span className="ml-2">
                              {job.companyInfo.industry}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Company Size:</span>
                            <span className="ml-2">{job.companyInfo.size}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Founded:</span>
                            <span className="ml-2">
                              {job.companyInfo.founded}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Headquarters:</span>
                            <span className="ml-2">
                              {job.companyInfo.headquarters}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <a
                        href={job.companyInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit Website</span>
                      </a>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        No Reviews Yet
                      </h3>
                      <p className="text-gray-400">
                        Be the first to review this company after working here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Similar Jobs */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
              <div className="space-y-4">
                {similarJobs.slice(0, 3).map((similarJob) => (
                  <Link
                    key={similarJob.id}
                    to={`/jobs/${similarJob.id}`}
                    className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <h4 className="font-medium mb-1">{similarJob.title}</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      {similarJob.company}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{similarJob.location}</span>
                      <span>
                        {similarJob.salary
                          ? formatSalary(similarJob.salary)
                          : "Competitive"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {similarJobs.length > 3 && (
                <Link
                  to="/jobs"
                  className="block mt-4 text-center py-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View More Similar Jobs
                </Link>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left">
                  Set Job Alert
                </button>
                <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left">
                  Share with Friend
                </button>
                <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left">
                  Report Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          job={job}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={handleApplicationSubmit}
          userTier="free"
          remainingApplications={3}
        />
      )}
    </div>
  );
}
