import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Building2,
  ExternalLink,
  Bookmark,
  Send,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";
import jobsApiService from "../../services/jobsApiService";

const JobDetailModal = ({ job, isOpen, onClose, onApply, onSave }) => {
  const [jobDetails, setJobDetails] = useState(job);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen && job) {
      setJobDetails(job);
      // You can fetch more details here if needed
      // loadJobDetails(job.id);
    }
  }, [isOpen, job]);

  const handleSave = async () => {
    if (!jobDetails) return;

    try {
      const result = await jobsApiService.saveJob(jobDetails.id);
      if (result.success) {
        setSaved(true);
        onSave?.(jobDetails.id);
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleApply = () => {
    onApply?.(jobDetails);
    onClose();
  };

  if (!isOpen || !jobDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{jobDetails.title}</h1>
              <div className="flex items-center space-x-4 text-blue-100">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span className="text-lg">{jobDetails.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{jobDetails.location}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-sm text-blue-100">Posted</div>
                  <div className="font-semibold">
                    {jobDetails.posted || "Recently"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-sm text-blue-100">Type</div>
                  <div className="font-semibold">
                    {jobDetails.type || "Full-time"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-sm text-blue-100">Salary</div>
                  <div className="font-semibold">
                    {jobDetails.salary || "Competitive"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Job Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {jobDetails.description ||
                      "No description available for this position."}
                  </p>
                </div>
              </div>

              {/* Requirements/Skills */}
              {jobDetails.skills && jobDetails.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {jobDetails.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* External Link */}
              {jobDetails.link && jobDetails.link !== "#" && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">
                    Original Posting
                  </h2>
                  <a
                    href={jobDetails.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View on company website
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Action Buttons */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <button
                    onClick={handleApply}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Apply Now
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`w-full py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center ${
                      saved
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {saved ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save Job
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">
                  About {jobDetails.company}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>{jobDetails.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{jobDetails.location}</span>
                  </div>
                  {jobDetails.isRemote && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Remote work available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
