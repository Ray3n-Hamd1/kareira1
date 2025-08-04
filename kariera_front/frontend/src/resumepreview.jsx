import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserResume } from "../../services/resumeService";

const ResumePreview = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const data = await getUserResume();
        setResumeData(data);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setError("Failed to load resume data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, []);

  const handleEditResume = () => {
    navigate("/resume/build");
  };

  const handleDownloadResume = () => {
    // In a real implementation, this would generate a PDF
    alert("Resume download functionality will be implemented in the future.");
  };

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-xl">Loading your resume...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  // If no resume data exists yet
  if (!resumeData || Object.keys(resumeData).length === 0) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">No Resume Data Found</h1>
          <p className="text-gray-400 mb-6">
            You haven't created a resume yet. Start building your professional
            resume now!
          </p>
          <button
            onClick={handleEditResume}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your Resume
          </button>
        </div>
      </div>
    );
  }

  // Destructure resume data
  const {
    personalInfo,
    workHistory,
    education,
    skills,
    certifications,
    projects,
  } = resumeData;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Resume Preview</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleEditResume}
              className="px-6 py-3 border border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
            >
              Edit Resume
            </button>
            <button
              onClick={handleDownloadResume}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
          <div className="flex space-x-4">
            {["modern", "classic", "minimal"].map((template) => (
              <button
                key={template}
                onClick={() => handleTemplateChange(template)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  selectedTemplate === template
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white text-black p-8 rounded-lg shadow-lg">
          {/* Modern Template */}
          {selectedTemplate === "modern" && (
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="border-b-2 border-purple-500 pb-6 mb-6">
                <h1 className="text-4xl font-bold text-gray-800">
                  {personalInfo?.fullName ||
                    `${personalInfo?.firstName || ""} ${
                      personalInfo?.lastName || ""
                    }`}
                </h1>
                <p className="text-xl text-purple-600 mt-2">
                  {personalInfo?.jobTitle}
                </p>
                <div className="flex flex-wrap mt-4 text-gray-600">
                  {personalInfo?.email && (
                    <div className="mr-6 mb-2">
                      <span className="font-semibold">Email:</span>{" "}
                      {personalInfo.email}
                    </div>
                  )}
                  {personalInfo?.phone && (
                    <div className="mr-6 mb-2">
                      <span className="font-semibold">Phone:</span>{" "}
                      {personalInfo.phone}
                    </div>
                  )}
                  {personalInfo?.cityCountry && (
                    <div className="mr-6 mb-2">
                      <span className="font-semibold">Location:</span>{" "}
                      {personalInfo.cityCountry}
                    </div>
                  )}
                  {personalInfo?.languages && (
                    <div className="mb-2">
                      <span className="font-semibold">Languages:</span>{" "}
                      {personalInfo.languages}
                    </div>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              {workHistory && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Work Experience
                  </h2>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="text-xl font-semibold">
                      {workHistory.jobTitle}
                    </h3>
                    <p className="text-lg text-gray-700">
                      {workHistory.employer}
                    </p>
                    <div className="flex text-gray-600 mt-1 mb-2">
                      <span>{workHistory.jobType}</span>
                      {workHistory.workMode && <span className="mx-2">•</span>}
                      <span>{workHistory.workMode}</span>
                      {workHistory.location && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{workHistory.location}</span>
                        </>
                      )}
                    </div>
                    <div
                      className="text-gray-700 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: workHistory.jobDescription,
                      }}
                    />
                    {workHistory.currentlyWorking && (
                      <p className="text-purple-600 mt-2 italic">
                        Currently working here
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {education && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Education
                  </h2>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="text-xl font-semibold">
                      {education.degree}
                    </h3>
                    <p className="text-lg text-gray-700">
                      {education.schoolName}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Field of Study: {education.fieldOfStudy}
                    </p>
                    {education.schoolLocation && (
                      <p className="text-gray-600">
                        {education.schoolLocation}
                      </p>
                    )}
                    {education.currentlyStudying && (
                      <p className="text-purple-600 mt-2 italic">
                        Currently studying
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Skills
                  </h2>
                  <div className="flex flex-wrap">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications &&
                certifications.length > 0 &&
                certifications.some((cert) => cert.title) && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Certifications
                    </h2>
                    <div className="space-y-4">
                      {certifications.map(
                        (cert, index) =>
                          cert.title && (
                            <div
                              key={index}
                              className="border-l-4 border-purple-500 pl-4 py-2"
                            >
                              <h3 className="text-xl font-semibold">
                                {cert.title}
                              </h3>
                              {cert.link && (
                                <a
                                  href={cert.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:underline"
                                >
                                  View Certificate
                                </a>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Projects */}
              {projects && projects.projectTitle && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Projects
                  </h2>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="text-xl font-semibold">
                      {projects.projectTitle}
                    </h3>
                    {projects.projectType && (
                      <p className="text-lg text-gray-700">
                        {projects.projectType}
                      </p>
                    )}
                    {projects.projectLink && (
                      <a
                        href={projects.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline block mb-2"
                      >
                        Project Link
                      </a>
                    )}
                    <div
                      className="text-gray-700 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: projects.projectDescription,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Classic Template */}
          {selectedTemplate === "classic" && (
            <div className="max-w-4xl mx-auto">
              {/* Header - Classic Style */}
              <div className="text-center pb-6 mb-6 border-b-2 border-gray-300">
                <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">
                  {personalInfo?.fullName ||
                    `${personalInfo?.firstName || ""} ${
                      personalInfo?.lastName || ""
                    }`}
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  {personalInfo?.jobTitle}
                </p>
                <div className="flex justify-center flex-wrap mt-4 text-gray-600 text-sm">
                  {personalInfo?.email && (
                    <div className="mx-3 mb-2">
                      <span>Email: {personalInfo.email}</span>
                    </div>
                  )}
                  {personalInfo?.phone && (
                    <div className="mx-3 mb-2">
                      <span>Phone: {personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo?.cityCountry && (
                    <div className="mx-3 mb-2">
                      <span>Location: {personalInfo.cityCountry}</span>
                    </div>
                  )}
                  {personalInfo?.languages && (
                    <div className="mx-3 mb-2">
                      <span>Languages: {personalInfo.languages}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Experience - Classic Style */}
              {workHistory && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-300 pb-2">
                    Work Experience
                  </h2>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">
                        {workHistory.jobTitle}
                      </h3>
                      <span className="text-gray-600 italic">
                        {workHistory.location}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>{workHistory.employer}</span>
                      <span>
                        {workHistory.jobType} • {workHistory.workMode}
                      </span>
                    </div>
                    <div
                      className="text-gray-700 mt-3"
                      dangerouslySetInnerHTML={{
                        __html: workHistory.jobDescription,
                      }}
                    />
                    {workHistory.currentlyWorking && (
                      <p className="text-gray-600 mt-2 italic">Present</p>
                    )}
                  </div>
                </div>
              )}

              {/* Education - Classic Style */}
              {education && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-300 pb-2">
                    Education
                  </h2>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">
                        {education.schoolName}
                      </h3>
                      <span className="text-gray-600 italic">
                        {education.schoolLocation}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>
                        {education.degree}, {education.fieldOfStudy}
                      </span>
                      <span>{education.educationLevel}</span>
                    </div>
                    {education.currentlyStudying && (
                      <p className="text-gray-600 mt-2 italic">Present</p>
                    )}
                  </div>
                </div>
              )}

              {/* Skills - Classic Style */}
              {skills && skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-300 pb-2">
                    Skills
                  </h2>
                  <p className="text-gray-700">{skills.join(", ")}</p>
                </div>
              )}

              {/* Certifications - Classic Style */}
              {certifications &&
                certifications.length > 0 &&
                certifications.some((cert) => cert.title) && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-300 pb-2">
                      Certifications
                    </h2>
                    <ul className="list-disc pl-5 text-gray-700">
                      {certifications.map(
                        (cert, index) =>
                          cert.title && (
                            <li key={index} className="mb-2">
                              {cert.title}
                              {cert.link && (
                                <a
                                  href={cert.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 ml-2 italic text-sm hover:underline"
                                >
                                  (View Certificate)
                                </a>
                              )}
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                )}

              {/* Projects - Classic Style */}
              {projects && projects.projectTitle && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-300 pb-2">
                    Projects
                  </h2>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">
                        {projects.projectTitle}
                      </h3>
                      <span className="text-gray-600 italic">
                        {projects.projectType}
                      </span>
                    </div>
                    <div
                      className="text-gray-700 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: projects.projectDescription,
                      }}
                    />
                    {projects.projectLink && (
                      <a
                        href={projects.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:underline text-sm italic"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Minimal Template */}
          {selectedTemplate === "minimal" && (
            <div className="max-w-4xl mx-auto">
              {/* Header - Minimal Style */}
              <div className="mb-10">
                <h1 className="text-3xl font-light text-gray-900">
                  {personalInfo?.fullName ||
                    `${personalInfo?.firstName || ""} ${
                      personalInfo?.lastName || ""
                    }`}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {personalInfo?.jobTitle}
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  {personalInfo?.email && (
                    <span className="mr-4">{personalInfo.email}</span>
                  )}
                  {personalInfo?.phone && (
                    <span className="mr-4">{personalInfo.phone}</span>
                  )}
                  {personalInfo?.cityCountry && (
                    <span>{personalInfo.cityCountry}</span>
                  )}
                </div>
                {personalInfo?.languages && (
                  <div className="mt-1 text-sm text-gray-500">
                    <span>Languages: {personalInfo.languages}</span>
                  </div>
                )}
              </div>

              {/* Skills - Minimal Style at Top */}
              {skills && skills.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-light text-gray-700 mb-2 uppercase tracking-wider">
                    Skills
                  </h2>
                  <div className="text-gray-700">{skills.join(" • ")}</div>
                </div>
              )}

              {/* Work Experience - Minimal Style */}
              {workHistory && (
                <div className="mb-10">
                  <h2 className="text-lg font-light text-gray-700 mb-4 uppercase tracking-wider">
                    Experience
                  </h2>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {workHistory.jobTitle}
                    </h3>
                    <p className="text-gray-600">
                      {workHistory.employer} • {workHistory.jobType} •{" "}
                      {workHistory.workMode}
                    </p>
                    {workHistory.location && (
                      <p className="text-gray-500 text-sm">
                        {workHistory.location}
                      </p>
                    )}
                    <div
                      className="text-gray-700 mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: workHistory.jobDescription,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Education - Minimal Style */}
              {education && (
                <div className="mb-10">
                  <h2 className="text-lg font-light text-gray-700 mb-4 uppercase tracking-wider">
                    Education
                  </h2>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {education.degree}
                    </h3>
                    <p className="text-gray-600">
                      {education.schoolName} • {education.fieldOfStudy}
                    </p>
                    {education.schoolLocation && (
                      <p className="text-gray-500 text-sm">
                        {education.schoolLocation}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Projects - Minimal Style */}
              {projects && projects.projectTitle && (
                <div className="mb-10">
                  <h2 className="text-lg font-light text-gray-700 mb-4 uppercase tracking-wider">
                    Projects
                  </h2>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {projects.projectTitle}
                    </h3>
                    {projects.projectType && (
                      <p className="text-gray-600">{projects.projectType}</p>
                    )}
                    <div
                      className="text-gray-700 mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: projects.projectDescription,
                      }}
                    />
                    {projects.projectLink && (
                      <a
                        href={projects.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 text-sm hover:underline mt-1 inline-block"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Certifications - Minimal Style */}
              {certifications &&
                certifications.length > 0 &&
                certifications.some((cert) => cert.title) && (
                  <div className="mb-10">
                    <h2 className="text-lg font-light text-gray-700 mb-4 uppercase tracking-wider">
                      Certifications
                    </h2>
                    {certifications.map(
                      (cert, index) =>
                        cert.title && (
                          <div key={index} className="mb-2">
                            <span className="text-gray-800">{cert.title}</span>
                            {cert.link && (
                              <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 ml-2 text-sm hover:underline"
                              >
                                View
                              </a>
                            )}
                          </div>
                        )
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
