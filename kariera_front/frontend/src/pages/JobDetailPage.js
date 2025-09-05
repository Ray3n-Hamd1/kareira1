// src/pages/JobDetailPage.js - Fixed version with consistent data
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getJobById, generateMockJobs } from "../services/mockJobService";
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
<li>Strong proficiency in ${foundJob.skills.slice(0, 2).join(" and ")}</li>
<li>Experience with ${foundJob.skills.slice(2).join(", ")}</li>
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
            description: `${foundJob.company} is a leading technology company that's revolutionizing how people connect and interact with technology. We're passionate about building products that make a meaningful impact on people's lives.`,
            founded: 2000 + Math.floor(Math.random() * 23),
            headquarters: foundJob.location.split(",")[0],
            employees: foundJob.companySize,
            website: `https://${foundJob.company
              .toLowerCase()
              .replace(/\s/g, "")}.com`,
            industry: "Technology",
            culture: [
              "Innovation-driven environment",
              "Work-life balance",
              "Continuous learning",
              "Diverse and inclusive",
              "Collaborative teams",
            ],
          },
          teamInfo: {
            manager: "Sarah Johnson",
            teamSize: "8-12 people",
            reportingStructure:
              "Engineering Manager → Director of Engineering → VP of Engineering",
          },
        };

        setJob(enhancedJob);
        setSaved(enhancedJob.saved);
        setApplied(enhancedJob.applied);

        // Generate similar jobs (get all jobs and filter for similar ones)
        const allJobs = generateMockJobs(100);
        const similar = allJobs
          .filter(
            (j) =>
              j.id !== id &&
              (j.company === foundJob.company ||
                j.skills.some((skill) => foundJob.skills.includes(skill)) ||
                j.experienceLevel === foundJob.experienceLevel)
          )
          .slice(0, 6);
        setSimilarJobs(similar);
      } catch (error) {
        console.error("Error loading job details:", error);
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobDetails();
  }, [id, navigate]);

  const handleSave = () => {
    setSaved(!saved);
    // In real app: await jobService.toggleSave(job.id);
  };

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.title} at ${job.company}`,
          text: `Check out this job opportunity: ${job.title} at ${job.company}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatSalary = (salary) => {
    if (salary?.min && salary?.max) {
      return `$${(salary.min / 1000).toFixed(0)}k - $${(
        salary.max / 1000
      ).toFixed(0)}k`;
    }
    return "Competitive salary";
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
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/jobs" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>{job.company}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{job.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl ${
                      job.companyLogo ? "hidden" : "flex"
                    }`}
                  >
                    {job.company.charAt(0)}
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {job.title}
                    </h1>
                    {job.featured && (
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    )}
                    {job.urgentHiring && (
                      <span className="px-3 py-1 text-sm bg-red-600 text-white rounded-full">
                        Urgent Hiring
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-300">
                      {job.company}
                    </h2>
                    {job.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-400">
                          {job.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Job Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-green-400">
                        {formatSalary(job.salary)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatPostedTime(job.posted)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleApply}
                  disabled={applied}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    applied
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {applied ? (
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

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    saved
                      ? "border-yellow-500 text-yellow-500 bg-yellow-500/10"
                      : "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  <BookmarkIcon
                    className={`w-5 h-5 ${saved ? "fill-current" : ""}`}
                  />
                  {saved ? "Saved" : "Save"}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {job.applicationCount}
                    </div>
                    <div className="text-sm text-gray-400">Applicants</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {job.experienceLevel}
                    </div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {job.remote ? "Remote" : "On-site"}
                    </div>
                    <div className="text-sm text-gray-400">Work Style</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="border-b border-gray-700">
                <nav className="flex">
                  {[
                    {
                      id: "description",
                      label: "Job Description",
                      icon: Briefcase,
                    },
                    { id: "company", label: "About Company", icon: Building2 },
                    { id: "reviews", label: "Reviews", icon: Star },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-purple-500 text-purple-400"
                          : "border-transparent text-gray-400 hover:text-white"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.fullDescription }}
                    />

                    {/* Skills Required */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Skills & Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Benefits & Perks
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {job.benefits.map((benefit, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <Heart className="w-4 h-4 text-red-400" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "company" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        About {job.company}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {job.companyInfo.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-white mb-2">
                          Company Info
                        </h4>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Founded {job.companyInfo.founded}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{job.companyInfo.employees}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.companyInfo.headquarters}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <a
                              href={job.companyInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300"
                            >
                              Company Website
                              <ExternalLink className="w-3 h-3 inline ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">
                          Culture & Values
                        </h4>
                        <div className="space-y-2">
                          {job.companyInfo.culture.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm text-gray-300"
                            >
                              <Trophy className="w-4 h-4 text-yellow-400" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Reviews Coming Soon
                    </h3>
                    <p className="text-gray-400">
                      Employee reviews and ratings will be available soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Ready to Apply?
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Salary Range</span>
                  <span className="text-green-400 font-medium">
                    {formatSalary(job.salary)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Job Type</span>
                  <span className="text-white">{job.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-white">{job.experienceLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Applications</span>
                  <span className="text-white">
                    {job.applicationCount} people applied
                  </span>
                </div>
              </div>

              <button
                onClick={handleApply}
                disabled={applied}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  applied
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {applied ? "Application Submitted" : "Apply for this Job"}
              </button>

              {!applied && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Takes less than 2 minutes
                </p>
              )}
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Similar Jobs
                </h3>
                <div className="space-y-4">
                  {similarJobs.slice(0, 3).map((similarJob) => (
                    <Link
                      key={similarJob.id}
                      to={`/jobs/${similarJob.id}`}
                      className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <h4 className="font-medium text-white mb-1">
                        {similarJob.title}
                      </h4>
                      <p className="text-sm text-gray-400 mb-2">
                        {similarJob.company}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{similarJob.location}</span>
                        <span>{formatSalary(similarJob.salary)}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  to="/jobs"
                  className="block text-center text-purple-400 hover:text-purple-300 text-sm mt-4"
                >
                  View All Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          job={job}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={(applicationData) => {
            console.log("Application submitted:", applicationData);
            setApplied(true);
            setShowApplicationModal(false);
            alert("Application submitted successfully!");
          }}
        />
      )}
    </div>
  );
}
