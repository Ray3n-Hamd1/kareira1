import React, { useState, useEffect } from "react";

// Mock Auth Context for demonstration
const useAuth = () => ({
  isAuthenticated: true,
  loading: false,
});

// Mock Navigate for demonstration
const useNavigate = () => (path) => console.log("Navigate to:", path);
const ProfessionalResumePreview = ({ formData }) => {
  return (
    <>
      {/* Print styles - keep same design as preview, just hide UI elements */}
      <style>{`
  @media print {
    @page {
      size: A4;
      margin: 0.5in;
    }
    
    /* Hide UI elements only */
    button,
    .sticky,
    [class*="button"],
    [class*="btn"],
    .bg-purple-600,
    .bg-gray-600,
    .fixed {
      display: none !important;
    }
    
    /* Keep the same container styling as preview */
    .resume-print-container {
      box-shadow: none !important;
      border-radius: 0 !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 24px !important;
      font-family: Arial, sans-serif !important;
      background: white !important;
    }
    
    /* Keep all the same typography and spacing */
    .resume-print-container h1 {
      font-size: 36px !important;
      font-weight: bold !important;
      color: #111827 !important;
    }
    
    .resume-print-container h2 {
      font-size: 20px !important;
      font-weight: 600 !important;
      color: #111827 !important;
      border-bottom: 1px solid #e5e7eb !important;
      padding-bottom: 4px !important;
      margin-bottom: 12px !important;
    }
    
    .resume-print-container h3 {
      font-weight: 600 !important;
      color: #111827 !important;
    }
    
    .resume-print-container p {
      color: #374151 !important;
    }
    
    /* Keep the same border styling */
    .border-b-2 {
      border-bottom: 2px solid #e5e7eb !important;
    }
    
    .border-b {
      border-bottom: 1px solid #e5e7eb !important;
    }
    
    /* Keep the same spacing */
    .mb-6 {
      margin-bottom: 24px !important;
    }
    
    .mb-5 {
      margin-bottom: 20px !important;
    }
    
    .mb-4 {
      margin-bottom: 16px !important;
    }
    
    .mb-3 {
      margin-bottom: 12px !important;
    }
    
    .mb-2 {
      margin-bottom: 8px !important;
    }
    
    .pb-4 {
      padding-bottom: 16px !important;
    }
    
    .pb-1 {
      padding-bottom: 4px !important;
    }
    
    /* Keep flex layouts */
    .flex {
      display: flex !important;
    }
    
    .justify-between {
      justify-content: space-between !important;
    }
    
    .items-start {
      align-items: flex-start !important;
    }
    
    .text-center {
      text-align: center !important;
    }
    
    .text-right {
      text-align: right !important;
    }
    
    /* Keep skill tags styling */
    .skill-tag {
      background-color: #f3f4f6 !important;
      color: #1f2937 !important;
      padding: 4px 12px !important;
      border-radius: 9999px !important;
      font-size: 14px !important;
      display: inline-block !important;
      margin: 2px !important;
    }
    
    /* Keep list styling */
    .list-disc {
      list-style-type: disc !important;
    }
    
    .ml-6 {
      margin-left: 24px !important;
    }
    
    /* Keep link colors for screen-like appearance */
    a {
      color: #2563eb !important;
    }
    
    a:hover {
      text-decoration: underline !important;
    }
    
    /* Page breaks only where needed */
    .resume-section {
      page-break-inside: avoid;
    }
    
    .resume-item {
      page-break-inside: avoid;
    }
  }
`}</style>

      <div
        className="resume-print-container bg-white text-gray-900 p-6 max-w-3xl mx-auto shadow-lg rounded-xl"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="resume-header text-center border-b-2 border-gray-200 pb-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {formData.firstName && formData.lastName
              ? `${formData.firstName} ${formData.lastName}`
              : "Your Name"}
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            {formData.jobTitle || "Your Job Title"}
          </p>
          <div className="text-sm text-gray-600">
            {formData.email && <span>{formData.email}</span>}
            {formData.phone && formData.email && <span> • </span>}
            {formData.phone && <span>{formData.phone}</span>}
            {(formData.email || formData.phone) && formData.cityCountry && (
              <span> • </span>
            )}
            {formData.cityCountry && <span>{formData.cityCountry}</span>}
          </div>
          {(formData.website ||
            formData.linkedin ||
            (formData.additionalLinks &&
              formData.additionalLinks.length > 0 &&
              formData.additionalLinks.some(
                (link) => link.url && link.label
              ))) && (
            <div className="text-sm text-gray-600 mt-2">
              {formData.website && (
                <span>
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                </span>
              )}
              {formData.linkedin && (
                <span>
                  {formData.website && " • "}
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn
                  </a>
                </span>
              )}
              {formData.additionalLinks &&
                formData.additionalLinks.map((link, index) =>
                  link.url && link.label ? (
                    <span key={index}>
                      {(formData.website || formData.linkedin || index > 0) &&
                        " • "}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.label}
                      </a>
                    </span>
                  ) : null
                )}
            </div>
          )}
        </div>

        {/* Summary */}
        {formData.summary && formData.summary.trim() !== "" && (
          <div className="resume-section mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              {formData.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {formData.workExperiences &&
          formData.workExperiences.length > 0 &&
          formData.workExperiences[0].workJobTitle && (
            <div className="resume-section mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Experience
              </h2>
              {formData.workExperiences.map((work, index) => (
                <div key={index} className="resume-item mb-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {work.workJobTitle || "Job Title"}
                      </h3>
                      <p className="text-base font-medium text-gray-700">
                        {work.employer || "Company Name"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {work.workLocation || "Location"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {work.workStartMonth && work.workStartYear
                          ? `${String(work.workStartMonth).padStart(2, "0")}/${
                              work.workStartYear
                            }`
                          : "01/2020"}{" "}
                        -{" "}
                        {work.currentlyWorking
                          ? "Present"
                          : work.workEndMonth && work.workEndYear
                          ? `${String(work.workEndMonth).padStart(2, "0")}/${
                              work.workEndYear
                            }`
                          : "Present"}
                      </p>
                    </div>
                  </div>
                  {work.jobDescription && (
                    <ul className="text-base text-gray-700 ml-6 list-disc">
                      {work.jobDescription
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, lineIndex) => (
                          <li key={lineIndex} className="mb-2">
                            {line.trim()}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Education - Only show if user has started filling out education */}
        {((formData.educationExperiences?.length > 0 &&
          (formData.educationExperiences[0].schoolName ||
            formData.educationExperiences[0].degree ||
            formData.educationExperiences[0].fieldOfStudy)) ||
          (formData.education?.length > 0 &&
            (formData.education[0].schoolName ||
              formData.education[0].degree ||
              formData.education[0].fieldOfStudy)) ||
          formData.schoolName ||
          formData.degree ||
          formData.fieldOfStudy) && (
          <div className="resume-section mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              Education
            </h2>
            {/* Handle array format */}
            {(formData.educationExperiences || formData.education || []).map(
              (edu, index) => {
                if (!edu) return null;
                return (
                  <div key={index} className="resume-item mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {edu.degree || edu.schoolName || "Education"}
                        </h3>
                        <p className="text-base text-gray-700">
                          {edu.schoolName || edu.institution || "Institution"}
                        </p>
                        {edu.fieldOfStudy && (
                          <p className="text-sm text-gray-600">
                            {edu.fieldOfStudy}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {edu.schoolLocation && (
                          <p className="text-sm text-gray-600">
                            {edu.schoolLocation}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {edu.graduationMonth && edu.graduationYear
                            ? `${new Date(
                                2024,
                                parseInt(edu.graduationMonth) - 1
                              ).toLocaleString("default", { month: "long" })} ${
                                edu.graduationYear
                              }`
                            : edu.graduationYear || "Graduation Date"}
                        </p>
                      </div>
                    </div>

                    {/* Additional Education Details */}
                    {(edu.awards ||
                      edu.academicScholarships ||
                      edu.sportsScholarships ||
                      edu.gpa ||
                      edu.club) && (
                      <div className="ml-6 mt-2">
                        {edu.awards && edu.awardName && (
                          <p className="text-sm text-gray-600">
                            • Award: {edu.awardName}{" "}
                            {edu.awardYear && `(${edu.awardYear})`}
                          </p>
                        )}
                        {edu.academicScholarships &&
                          edu.academicScholarshipName && (
                            <p className="text-sm text-gray-600">
                              • Academic Scholarship:{" "}
                              {edu.academicScholarshipName}{" "}
                              {edu.academicScholarshipYear &&
                                `(${edu.academicScholarshipYear})`}
                              {edu.academicScholarshipBody &&
                                ` - ${edu.academicScholarshipBody}`}
                            </p>
                          )}
                        {edu.sportsScholarships &&
                          edu.sportsScholarshipName && (
                            <p className="text-sm text-gray-600">
                              • Sports Scholarship: {edu.sportsScholarshipName}{" "}
                              {edu.sportsScholarshipYear &&
                                `(${edu.sportsScholarshipYear})`}
                              {edu.sportsScholarshipBody &&
                                ` - ${edu.sportsScholarshipBody}`}
                            </p>
                          )}
                        {edu.gpa && edu.gpaValue && (
                          <p className="text-sm text-gray-600">
                            • GPA: {edu.gpaValue}
                          </p>
                        )}
                        {edu.club && edu.clubName && (
                          <p className="text-sm text-gray-600">
                            • Club: {edu.clubName}
                            {(edu.clubStartYear || edu.clubEndYear) &&
                              ` (${edu.clubStartYear || "Start"} - ${
                                edu.clubEndYear || "End"
                              })`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}

            {/* Handle direct object format (fallback) */}
            {!formData.educationExperiences?.length &&
              !formData.education?.length &&
              (formData.schoolName ||
                formData.degree ||
                formData.fieldOfStudy) && (
                <div className="resume-item mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {formData.degree || "Degree"}
                      </h3>
                      <p className="text-base text-gray-700">
                        {formData.schoolName || "Institution"}
                      </p>
                      {formData.fieldOfStudy && (
                        <p className="text-sm text-gray-600">
                          {formData.fieldOfStudy}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {formData.schoolLocation && (
                        <p className="text-sm text-gray-600">
                          {formData.schoolLocation}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {formData.graduationYear || "Graduation Date"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Projects */}
        {formData.projects &&
          formData.projects.length > 0 &&
          formData.projects[0].projectTitle && (
            <div className="resume-section mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Projects
              </h2>
              {formData.projects.map((project, index) => (
                <div key={index} className="resume-item mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {project.projectTitle || "Project Title"}
                      </h3>
                      {project.projectType && (
                        <p className="text-sm text-gray-600">
                          {project.projectType}
                        </p>
                      )}
                      {project.projectLink && (
                        <p className="text-sm">
                          <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Project
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  {project.projectDescription && (
                    <div className="text-base text-gray-700 ml-6">
                      {project.projectDescription
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, lineIndex) => (
                          <p key={lineIndex} className="mb-1">
                            {line.trim()}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Skills/Interests */}
        {formData.skills &&
          formData.skills.length > 0 &&
          formData.skills.some((skill) => skill && skill.trim()) && (
            <div className="resume-section mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Interests/Hobbies
              </h2>
              <div className="skill-tags flex flex-wrap gap-2">
                {formData.skills
                  .filter((skill) => skill && skill.trim())
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="skill-tag bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          )}

        {/* Additional Interests */}
        {formData.interests &&
          formData.interests.length > 0 &&
          formData.interests.some(
            (interest) => interest && interest.trim()
          ) && (
            <div className="resume-section mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Additional Interests
              </h2>
              <div className="skill-tags flex flex-wrap gap-2">
                {formData.interests
                  .filter((interest) => interest && interest.trim())
                  .map((interest, index) => (
                    <span
                      key={index}
                      className="skill-tag bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
              </div>
            </div>
          )}

        {/* Certifications */}
        {formData.certificates &&
          formData.certificates.length > 0 &&
          formData.certificates.some(
            (cert) => cert.title && cert.title.trim()
          ) && (
            <div className="resume-section mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Certifications
              </h2>
              {formData.certificates
                .filter((cert) => cert.title && cert.title.trim())
                .map((cert, index) => (
                  <div key={index} className="resume-item mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {cert.title}
                    </h3>
                    {cert.link && (
                      <p className="text-sm">
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Certificate
                        </a>
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}

        {/* References */}
        {formData.references &&
          formData.references.length > 0 &&
          formData.references.some((ref) => ref.name && ref.name.trim()) && (
            <div className="resume-section mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                References
              </h2>
              {formData.references
                .filter((ref) => ref.name && ref.name.trim())
                .map((ref, index) => (
                  <div key={index} className="resume-item mb-3">
                    <h3 className="font-semibold text-gray-900">{ref.name}</h3>
                    {ref.relationship && (
                      <p className="text-sm text-gray-700">
                        {ref.relationship}
                      </p>
                    )}
                    {ref.contact && (
                      <p className="text-sm text-gray-600">{ref.contact}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
      </div>
    </>
  );
};
const ResumePreviewModal = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  // Proper print function that only prints resume content
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Get the resume content
    const resumeContent = document.querySelector(
      ".resume-print-container"
    ).outerHTML;

    // Create the print document
    printWindow.document.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Resume - ${formData.firstName} ${formData.lastName}</title>
      <style>
        @page {
          size: A4;
          margin: 0.5in;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: white;
        }
        
        /* Keep the same container styling as preview */
        .resume-print-container {
          max-width: none;
          margin: 0;
          padding: 20px;
          box-shadow: none;
          border-radius: 0;
          background: white;
          font-family: Arial, sans-serif;
        }
        
        /* Smaller typography */
        h1 {
          font-size: 26px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 6px;
        }
        
        h2 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 3px;
          margin-bottom: 10px;
        }
        
        h3 {
          font-weight: 600;
          color: #111827;
          font-size: 13px;
        }
        
        p {
          color: #374151;
          font-size: 11px;
        }
        
        /* Keep the same border styling */
        .border-b-2 {
          border-bottom: 2px solid #e5e7eb;
        }
        
        .border-b {
          border-bottom: 1px solid #e5e7eb;
        }
        
        /* Smaller spacing */
        .mb-6 { margin-bottom: 18px; }
        .mb-5 { margin-bottom: 15px; }
        .mb-4 { margin-bottom: 12px; }
        .mb-3 { margin-bottom: 9px; }
        .mb-2 { margin-bottom: 6px; }
        .pb-4 { padding-bottom: 12px; }
        .pb-1 { padding-bottom: 3px; }
        
        /* Keep flex layouts */
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-start { align-items: flex-start; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        
        /* Smaller skill tags */
        .skill-tag {
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 10px;
          display: inline-block;
          margin: 1px;
        }
        
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        
        /* Keep list styling */
        .list-disc { list-style-type: disc; }
        .ml-6 { margin-left: 20px; }
        
        /* Keep link colors */
        a { color: #2563eb; text-decoration: none; }
        a:hover { text-decoration: underline; }
        
        /* Page breaks */
        .resume-section { page-break-inside: avoid; }
        .resume-item { page-break-inside: avoid; }
        
        /* Smaller utility classes */
        .text-sm { font-size: 11px; }
        .text-base { font-size: 12px; }
        .text-xl { font-size: 16px; }
        .text-4xl { font-size: 26px; }
        .font-bold { font-weight: bold; }
        .font-semibold { font-weight: 600; }
        .text-gray-900 { color: #111827; }
        .text-gray-700 { color: #374151; }
        .text-gray-600 { color: #4b5563; }
        .leading-relaxed { line-height: 1.5; }
        
        /* Smaller bullets */
        li { font-size: 11px; margin-bottom: 1px; }
        ul { margin: 3px 0 3px 16px; padding: 0; }
      </style>
    </head>
    <body>
      ${resumeContent}
    </body>
  </html>
`);

    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Print/Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <div className="p-4">
          <ProfessionalResumePreview formData={formData} />
        </div>
      </div>
    </div>
  );
};
// Progress Steps Component
const ProgressSteps = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, name: "Personal Info" },
    { id: 2, name: "Work History" },
    { id: 3, name: "Education" },
    { id: 4, name: "Skills" },
    { id: 5, name: "Certifications" },
    { id: 6, name: "Projects" },
    { id: 7, name: "Finalize" },
  ];

  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="flex items-center justify-between flex-1 mr-6 bg-transparent rounded-full px-2 py-2 overflow-x-auto">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                step.id === currentStep
                  ? "bg-purple-600 text-white"
                  : step.id < currentStep
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            >
              {step.id}. {step.name}
            </div>
          ))}
        </div>
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {progressPercentage}%
        </div>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1">
        <div
          className="bg-purple-600 h-1 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Template Preview Component
const TemplatePreview = ({ formData }) => {
  return (
    <div className="bg-transparent rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Resume Preview</h3>
      <p className="text-gray-400 text-sm mb-6">Live preview of your resume</p>

      <div
        className="bg-white text-black rounded-xl p-4 mb-6 h-96 overflow-y-auto text-xs"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-gray-200 pb-3 mb-4">
          <h1 className="text-lg font-bold text-gray-900 mb-1">
            {formData.firstName && formData.lastName
              ? `${formData.firstName} ${formData.lastName}`
              : "Your Name"}
          </h1>
          <p className="text-sm text-gray-700 mb-1">
            {formData.jobTitle || "Your Job Title"}
          </p>
          <div className="text-xs text-gray-600">
            {formData.email && <span>{formData.email}</span>}
            {formData.phone && formData.email && <span> • </span>}
            {formData.phone && <span>{formData.phone}</span>}
            {(formData.email || formData.phone) && formData.cityCountry && (
              <span> • </span>
            )}
            {formData.cityCountry && <span>{formData.cityCountry}</span>}
          </div>
          {(formData.website ||
            formData.linkedin ||
            (formData.additionalLinks &&
              formData.additionalLinks.length > 0 &&
              formData.additionalLinks.some(
                (link) => link.url && link.label
              ))) && (
            <div className="text-xs text-gray-600 mt-1">
              {formData.website && (
                <span>
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Website
                  </a>
                </span>
              )}
              {formData.linkedin && (
                <span>
                  {formData.website && " • "}
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    LinkedIn
                  </a>
                </span>
              )}
              {formData.additionalLinks &&
                formData.additionalLinks.map((link, index) =>
                  link.url && link.label ? (
                    <span key={index}>
                      {(formData.website || formData.linkedin || index > 0) &&
                        " • "}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        {link.label}
                      </a>
                    </span>
                  ) : null
                )}
            </div>
          )}
        </div>

        {/* Summary */}
        {formData.summary && formData.summary.trim() !== "" && (
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">
              {formData.summary.length > 150
                ? `${formData.summary.substring(0, 150)}...`
                : formData.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {formData.workExperiences &&
          formData.workExperiences.length > 0 &&
          formData.workExperiences[0].workJobTitle && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                Experience
              </h2>
              {formData.workExperiences.map((work, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900">
                        {work.workJobTitle || "Job Title"}
                      </h3>
                      <p className="text-xs font-medium text-gray-700">
                        {work.employer || "Company Name"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">
                        {work.workLocation || "Location"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {work.workStartMonth && work.workStartYear
                          ? `${String(work.workStartMonth).padStart(2, "0")}/${
                              work.workStartYear
                            }`
                          : "01/2020"}{" "}
                        -{" "}
                        {work.currentlyWorking
                          ? "Present"
                          : work.workEndMonth && work.workEndYear
                          ? `${String(work.workEndMonth).padStart(2, "0")}/${
                              work.workEndYear
                            }`
                          : "Present"}
                      </p>
                    </div>
                  </div>
                  {work.jobDescription && (
                    <div className="text-xs text-gray-700 ml-4">
                      {work.jobDescription
                        .split("\n")
                        .filter((line) => line.trim())
                        .slice(0, 2)
                        .map((line, lineIndex) => (
                          <div key={lineIndex} className="mb-1">
                            • {line.trim().substring(0, 80)}
                            {line.trim().length > 80 ? "..." : ""}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Education */}
        {((formData.educationExperiences &&
          formData.educationExperiences.length > 0 &&
          formData.educationExperiences.some(
            (edu) => edu.schoolName && edu.schoolName.trim() !== ""
          )) ||
          (formData.education &&
            formData.education.length > 0 &&
            formData.education.some(
              (edu) => edu.schoolName && edu.schoolName.trim() !== ""
            )) ||
          (formData.schoolName && formData.schoolName.trim() !== "") ||
          (formData.degree && formData.degree.trim() !== "") ||
          (formData.fieldOfStudy && formData.fieldOfStudy.trim() !== "")) && (
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
              Education
            </h2>
            {(formData.educationExperiences || formData.education || [])
              .filter(
                (edu) =>
                  edu && (edu.schoolName || edu.degree || edu.fieldOfStudy)
              )
              .map((edu, index) => {
                if (!edu) return null;
                return (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-900">
                          {edu.degree || edu.schoolName || "Education"}
                        </h3>
                        <p className="text-xs text-gray-700">
                          {edu.schoolName || edu.institution || "Institution"}
                        </p>
                        {edu.fieldOfStudy && (
                          <p className="text-xs text-gray-600">
                            {edu.fieldOfStudy}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {edu.schoolLocation && (
                          <p className="text-xs text-gray-600">
                            {edu.schoolLocation}
                          </p>
                        )}
                        <p className="text-xs text-gray-600">
                          {edu.graduationMonth && edu.graduationYear
                            ? `${new Date(
                                2024,
                                parseInt(edu.graduationMonth) - 1
                              ).toLocaleString("default", { month: "long" })} ${
                                edu.graduationYear
                              }`
                            : edu.graduationYear || "Graduation Date"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Projects */}
        {formData.projects &&
          formData.projects.length > 0 &&
          formData.projects[0].projectTitle && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                Projects
              </h2>
              {formData.projects.map((project, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900">
                        {project.projectTitle || "Project Title"}
                      </h3>
                      {project.projectType && (
                        <p className="text-xs text-gray-600">
                          {project.projectType}
                        </p>
                      )}
                      {project.projectLink && (
                        <p className="text-xs">
                          <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                          >
                            View Project
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  {project.projectDescription && (
                    <div className="text-xs text-gray-700 ml-4">
                      {project.projectDescription.substring(0, 100)}
                      {project.projectDescription.length > 100 ? "..." : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Skills/Interests */}
        {formData.skills &&
          formData.skills.length > 0 &&
          formData.skills.some((skill) => skill && skill.trim()) && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                Interests/Hobbies
              </h2>
              <div className="flex flex-wrap gap-1">
                {formData.skills
                  .filter((skill) => skill && skill.trim())
                  .slice(0, 6)
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                {formData.skills.filter((skill) => skill && skill.trim())
                  .length > 6 && (
                  <span className="text-xs text-gray-500">
                    +
                    {formData.skills.filter((skill) => skill && skill.trim())
                      .length - 6}{" "}
                    more
                  </span>
                )}
              </div>
            </div>
          )}

        {/* Additional Interests */}
        {formData.interests &&
          formData.interests.length > 0 &&
          formData.interests.some(
            (interest) => interest && interest.trim()
          ) && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                Additional Interests
              </h2>
              <div className="flex flex-wrap gap-1">
                {formData.interests
                  .filter((interest) => interest && interest.trim())
                  .slice(0, 4)
                  .map((interest, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
              </div>
            </div>
          )}
      </div>

      <button className="w-full py-2 px-4 border-2 border-purple-600 text-purple-400 rounded-xl hover:bg-purple-600 hover:text-white transition-colors">
        Change Template
      </button>
    </div>
  );
};

// Rich Text Editor Component
const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Enter description",
}) => {
  const [content, setContent] = useState(value || "");

  useEffect(() => {
    setContent(value || "");
  }, [value]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue =
        content.substring(0, start) + "  " + content.substring(end);
      setContent(newValue);
      onChange(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="bg-transparent border border-gray-700 rounded-xl">
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={6}
        className="w-full p-4 text-white bg-transparent focus:outline-none resize-none"
        style={{ minHeight: "150px" }}
      />
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          Use bullet points and action verbs for better impact
        </div>
      </div>
    </div>
  );
};

// Step 1: Personal Information
const PersonalInfoStep = ({ formData, handleChange, error }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          What's the best way for employers to contact you?
        </h1>
        <p className="text-gray-400 mb-8">
          Including an email and phone number is advisable
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName || ""}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName || ""}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Professional (job title) <span className="text-red-400">*</span>
            </label>
            <input
              id="jobTitle"
              type="text"
              value={formData.jobTitle || ""}
              onChange={handleChange}
              placeholder="e.g UI/UX Designer"
              required
              className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="languages"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Languages
            </label>
            <input
              id="languages"
              type="text"
              value={formData.languages || ""}
              onChange={handleChange}
              placeholder="e.g English, French"
              className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                District
              </label>
              <input
                id="district"
                type="text"
                value={formData.district || ""}
                onChange={handleChange}
                placeholder="Enter district name"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="cityCountry"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                City-country
              </label>
              <input
                id="cityCountry"
                type="text"
                value={formData.cityCountry || ""}
                onChange={handleChange}
                placeholder="e.g Lagos, Nigeria"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Postal code
              </label>
              <input
                id="postalCode"
                type="text"
                value={formData.postalCode || ""}
                onChange={handleChange}
                placeholder="Enter postal code"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <TemplatePreview formData={formData} />
      </div>
    </div>
  );
};

// Step 2: Work History (Multi-step)
const WorkHistoryStep = ({ formData, handleChange, error }) => {
  const [workSubStep, setWorkSubStep] = useState(3); // Start at summary
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);
  const [workError, setWorkError] = useState(""); // Local error state for work history

  // Initialize work experiences array if it doesn't exist
  const workExperiences = formData.workExperiences || [
    {
      workJobTitle: "",
      employer: "",
      workLocation: "",
      jobType: "Full time",
      workMode: "Remote",
      workStartMonth: "",
      workStartYear: "",
      workEndMonth: "",
      workEndYear: "",
      currentlyWorking: false,
      jobDescription: "",
    },
  ];

  // If there's no data in the first work experience, start at step 1
  useEffect(() => {
    const firstWork = workExperiences[0];
    if (!firstWork.workJobTitle && !firstWork.employer) {
      setWorkSubStep(1);
    }
  }, []);

  const currentWork = workExperiences[currentWorkIndex] || workExperiences[0];

  const handleWorkModeChange = (mode) => {
    updateCurrentWork("workMode", mode);
  };

  const updateCurrentWork = (field, value) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[currentWorkIndex] = {
      ...updatedExperiences[currentWorkIndex],
      [field]: value,
    };
    handleChange({
      target: { id: "workExperiences", value: updatedExperiences },
    });
    // Clear work error when user starts typing
    if (workError) setWorkError("");
  };

  const handleWorkFieldChange = (e) => {
    const { id, value, type, checked } = e.target;
    updateCurrentWork(id, type === "checkbox" ? checked : value);
  };

  const addNewWorkExperience = () => {
    const newWork = {
      workJobTitle: "",
      employer: "",
      workLocation: "",
      jobType: "Full time",
      workMode: "Remote",
      workStartMonth: "",
      workStartYear: "",
      workEndMonth: "",
      workEndYear: "",
      currentlyWorking: false,
      jobDescription: "",
    };
    const updatedExperiences = [...workExperiences, newWork];
    handleChange({
      target: { id: "workExperiences", value: updatedExperiences },
    });
    setCurrentWorkIndex(updatedExperiences.length - 1);
    setWorkSubStep(1); // Start from beginning for new work experience
    setWorkError(""); // Clear any errors
  };

  const deleteWorkExperience = (index) => {
    if (workExperiences.length > 1) {
      const updatedExperiences = workExperiences.filter((_, i) => i !== index);
      handleChange({
        target: { id: "workExperiences", value: updatedExperiences },
      });

      // Adjust current index if necessary
      if (currentWorkIndex >= updatedExperiences.length) {
        setCurrentWorkIndex(updatedExperiences.length - 1);
      }

      // Go back to summary if we deleted current work
      if (currentWorkIndex === index) {
        setWorkSubStep(3);
      }
    }
  };

  const editWorkExperience = (index) => {
    setCurrentWorkIndex(index);
    setWorkSubStep(1);
    setWorkError(""); // Clear any errors
  };

  const validateCurrentWorkStep = (step) => {
    // Step 1: Basic Info - require job title and employer
    if (step === 1) {
      if (!currentWork.workJobTitle || currentWork.workJobTitle.trim() === "") {
        return "Please fill out the job title field";
      }
      if (!currentWork.employer || currentWork.employer.trim() === "") {
        return "Please fill out the employer/company field";
      }
    }

    // Step 2: Job Description - require job description
    if (step === 2) {
      if (
        !currentWork.jobDescription ||
        currentWork.jobDescription.trim() === ""
      ) {
        return "Please fill out the job description field";
      }
    }

    return null;
  };

  const handleWorkNext = (fromStep) => {
    const validationError = validateCurrentWorkStep(fromStep);
    if (validationError) {
      setWorkError(validationError);
      return false;
    }

    setWorkError("");
    if (fromStep === 1) {
      setWorkSubStep(2);
    } else if (fromStep === 2) {
      setWorkSubStep(3);
    }
    return true;
  };

  const handleWorkBack = () => {
    setWorkError(""); // Clear errors when going back
    if (workSubStep > 1) {
      setWorkSubStep(workSubStep - 1);
    } else {
      // Go back to summary if at step 1
      setWorkSubStep(3);
    }
  };

  // Sub-step 1: Basic Job Information
  if (workSubStep === 1) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentWorkIndex === 0
                ? "Tell us about your most recent job"
                : `Edit work experience #${currentWorkIndex + 1}`}
            </h1>
            <p className="text-gray-400">
              You can include any work experience, internships, scholarships,
              <br />
              relevant coursework and academic achievements.
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            1/3
          </div>
        </div>

        {workError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {workError}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Title <span className="text-red-400">*</span>
              </label>
              <input
                id="workJobTitle"
                type="text"
                value={currentWork.workJobTitle || ""}
                onChange={handleWorkFieldChange}
                placeholder="e.g UI/UX Designer"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Employer/Company <span className="text-red-400">*</span>
              </label>
              <input
                id="employer"
                type="text"
                value={currentWork.employer || ""}
                onChange={handleWorkFieldChange}
                placeholder="e.g Grey finance"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                id="workLocation"
                type="text"
                value={currentWork.workLocation || ""}
                onChange={handleWorkFieldChange}
                placeholder="e.g lagos, Nigeria"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job type
              </label>
              <select
                id="jobType"
                value={currentWork.jobType || "Full time"}
                onChange={handleWorkFieldChange}
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Full time">Full time</option>
                <option value="Part time">Part time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Work Mode
            </label>
            <div className="flex items-center space-x-4">
              {["Remote", "Onsite", "Hybrid"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleWorkModeChange(mode)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 ${
                    currentWork.workMode === mode
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {currentWork.workMode === mode && <span>✓</span>}
                  <span>{mode}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  id="workStartMonth"
                  value={currentWork.workStartMonth || ""}
                  onChange={handleWorkFieldChange}
                  className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2024, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                <select
                  id="workStartYear"
                  value={currentWork.workStartYear || ""}
                  onChange={handleWorkFieldChange}
                  className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={2024 - i} value={2024 - i}>
                      {2024 - i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  id="workEndMonth"
                  value={currentWork.workEndMonth || ""}
                  onChange={handleWorkFieldChange}
                  disabled={currentWork.currentlyWorking}
                  className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2024, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                <select
                  id="workEndYear"
                  value={currentWork.workEndYear || ""}
                  onChange={handleWorkFieldChange}
                  disabled={currentWork.currentlyWorking}
                  className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={2024 - i} value={2024 - i}>
                      {2024 - i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="currentlyWorking"
              type="checkbox"
              checked={currentWork.currentlyWorking || false}
              onChange={handleWorkFieldChange}
              className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
            />
            <label className="ml-2 text-sm text-gray-300">
              I currently work here
            </label>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleWorkBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            {workExperiences.length === 1 && currentWorkIndex === 0
              ? "Cancel"
              : "Back to Summary"}
          </button>
          <button
            type="button"
            onClick={() => handleWorkNext(1)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Sub-step 2: Job Description
  if (workSubStep === 2) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Describe what you did
            </h1>
            <p className="text-gray-400">Describe your role in the job</p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            2/3
          </div>
        </div>

        {workError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {workError}
          </div>
        )}

        <div className="mb-8">
          <div className="text-white font-semibold text-lg mb-2">
            {currentWork.workJobTitle || "UI/UX Designer"} •{" "}
            {currentWork.employer || "Grey Finance"}
          </div>
          <div className="text-gray-400 text-sm">
            {currentWork.workLocation || "Lagos, Nigeria"} (
            {currentWork.workMode || "Remote"}) •{" "}
            {currentWork.workStartMonth && currentWork.workStartYear
              ? `${new Date(
                  2024,
                  parseInt(currentWork.workStartMonth) - 1
                ).toLocaleString("default", { month: "long" })} ${
                  currentWork.workStartYear
                }`
              : "September 2023"}{" "}
            -{" "}
            {currentWork.currentlyWorking
              ? "Present"
              : currentWork.workEndMonth && currentWork.workEndYear
              ? `${new Date(
                  2024,
                  parseInt(currentWork.workEndMonth) - 1
                ).toLocaleString("default", { month: "long" })} ${
                  currentWork.workEndYear
                }`
              : "August 2024"}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Description <span className="text-red-400">*</span>
          </label>

          <div className="bg-transparent border border-gray-700 rounded-xl p-4 mb-4">
            <div className="space-y-3 mb-4">
              {currentWork.jobDescription ? (
                currentWork.jobDescription
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-white text-sm">{line.trim()}</div>
                    </div>
                  ))
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-white text-sm">
                      Worked closely with marketing teams to align branding
                      elements within the UI/UX design.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-white text-sm">
                      Developed interactive mockups using prototyping tools such
                      as Sketch or Adobe XD for validation purposes before
                      implementation phases began.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-white text-sm">
                      Created style guides and design systems to maintain
                      consistency across all platforms and products.
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4 font-bold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white italic">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a1 1 0 012 0v1h8V4a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h1V4z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9.5H17a1 1 0 110 2h-5.586l4.293 4.293a1 1 0 010 1.414z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <RichTextEditor
            value={currentWork.jobDescription || ""}
            onChange={(value) => updateCurrentWork("jobDescription", value)}
            placeholder="Describe your role and responsibilities..."
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleWorkBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={() => handleWorkNext(2)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Sub-step 3: Work History Summary
  if (workSubStep === 3) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Work history summary
            </h1>
            <p className="text-gray-400 max-w-lg">
              A brief overview of your past roles, key achievements, and skills
              gained. This summary highlights your career progression and impact
              in previous positions.
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            3/3
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {workExperiences.map((work, index) => (
            <div
              key={index}
              className="bg-transparent border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      {work.workJobTitle || "Job Title"},{" "}
                      {work.employer || "Company Name"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {work.workLocation || "Location"} (
                      {work.workMode || "Remote"}) •{" "}
                      {work.workStartMonth && work.workStartYear
                        ? `${new Date(
                            2024,
                            parseInt(work.workStartMonth) - 1
                          ).toLocaleString("default", { month: "long" })} ${
                            work.workStartYear
                          }`
                        : "Start Date"}{" "}
                      -{" "}
                      {work.currentlyWorking
                        ? "Present"
                        : work.workEndMonth && work.workEndYear
                        ? `${new Date(
                            2024,
                            parseInt(work.workEndMonth) - 1
                          ).toLocaleString("default", { month: "long" })} ${
                            work.workEndYear
                          }`
                        : "End Date"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => editWorkExperience(index)}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  {workExperiences.length > 1 && (
                    <button
                      onClick={() => deleteWorkExperience(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {work.jobDescription ? (
                  work.jobDescription
                    .split("\n")
                    .filter((line) => line.trim())
                    .slice(0, 3)
                    .map((line, lineIndex) => (
                      <div key={lineIndex} className="text-gray-300 text-sm">
                        {line.trim()}
                      </div>
                    ))
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    No job description added yet
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => editWorkExperience(index)}
                  className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Edit description</span>
                </button>
                {work.jobDescription &&
                  work.jobDescription.split("\n").filter((line) => line.trim())
                    .length > 3 && (
                    <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                      <span>Show more details</span>
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addNewWorkExperience}
          className="w-full border-2 border-dashed border-gray-700 rounded-xl py-6 px-6 text-center hover:border-purple-500 hover:bg-gray-900/50 transition-colors mb-8"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-purple-400 text-lg">+</span>
            <span className="text-purple-400 font-medium">Add position</span>
          </div>
        </button>

        {/* This step uses main navigation buttons */}
      </div>
    );
  }

  return null;
};

// Step 3: Education (Multi-step)
const EducationStep = ({ formData, handleChange, error }) => {
  const [eduSubStep, setEduSubStep] = useState(3); // Start at summary
  const [currentEduIndex, setCurrentEduIndex] = useState(0);
  const [eduError, setEduError] = useState(""); // Local error state

  // Initialize education array if it doesn't exist
  const educationExperiences = formData.educationExperiences || [
    {
      educationLevel: "Bachelors",
      schoolName: "",
      schoolLocation: "",
      degree: "",
      fieldOfStudy: "",
      graduationMonth: "",
      graduationYear: "",
      currentlyStudying: false,
      // Additional info
      awards: false,
      awardName: "",
      awardYear: "",
      academicScholarships: false,
      academicScholarshipName: "",
      academicScholarshipYear: "",
      academicScholarshipBody: "",
      sportsScholarships: false,
      sportsScholarshipName: "",
      sportsScholarshipYear: "",
      sportsScholarshipBody: "",
      gpa: false,
      gpaValue: "",
      club: false,
      clubName: "",
      clubStartYear: "",
      clubEndYear: "",
    },
  ];

  // If there's no data in the first education, start at step 1
  useEffect(() => {
    const firstEdu = educationExperiences[0];
    if (!firstEdu.schoolName && !firstEdu.degree) {
      setEduSubStep(1);
    }
  }, []);

  const currentEdu =
    educationExperiences[currentEduIndex] || educationExperiences[0];

  const updateCurrentEducation = (field, value) => {
    const updatedExperiences = [...educationExperiences];
    updatedExperiences[currentEduIndex] = {
      ...updatedExperiences[currentEduIndex],
      [field]: value,
    };
    handleChange({
      target: { id: "educationExperiences", value: updatedExperiences },
    });
    // Clear error when user starts typing
    if (eduError) setEduError("");
  };

  const handleEduFieldChange = (e) => {
    const { id, value, type, checked } = e.target;
    updateCurrentEducation(id, type === "checkbox" ? checked : value);
  };

  const addNewEducation = () => {
    const newEdu = {
      educationLevel: "Bachelors",
      schoolName: "",
      schoolLocation: "",
      degree: "",
      fieldOfStudy: "",
      graduationMonth: "",
      graduationYear: "",
      currentlyStudying: false,
      // Additional info
      awards: false,
      awardName: "",
      awardYear: "",
      academicScholarships: false,
      academicScholarshipName: "",
      academicScholarshipYear: "",
      academicScholarshipBody: "",
      sportsScholarships: false,
      sportsScholarshipName: "",
      sportsScholarshipYear: "",
      sportsScholarshipBody: "",
      gpa: false,
      gpaValue: "",
      club: false,
      clubName: "",
      clubStartYear: "",
      clubEndYear: "",
    };
    const updatedExperiences = [...educationExperiences, newEdu];
    handleChange({
      target: { id: "educationExperiences", value: updatedExperiences },
    });
    setCurrentEduIndex(updatedExperiences.length - 1);
    setEduSubStep(1);
    setEduError("");
  };

  const deleteEducation = (index) => {
    if (educationExperiences.length > 1) {
      const updatedExperiences = educationExperiences.filter(
        (_, i) => i !== index
      );
      handleChange({
        target: { id: "educationExperiences", value: updatedExperiences },
      });

      if (currentEduIndex >= updatedExperiences.length) {
        setCurrentEduIndex(updatedExperiences.length - 1);
      }

      if (currentEduIndex === index) {
        setEduSubStep(3);
      }
    }
  };

  const editEducation = (index) => {
    setCurrentEduIndex(index);
    setEduSubStep(1);
    setEduError("");
  };

  const validateCurrentEduStep = (step) => {
    // Step 1: Basic Info - require school name, degree, field of study
    if (step === 1) {
      if (!currentEdu.schoolName || currentEdu.schoolName.trim() === "") {
        return "Please fill out the school name field";
      }
      if (!currentEdu.degree || currentEdu.degree.trim() === "") {
        return "Please fill out the degree field";
      }
      if (!currentEdu.fieldOfStudy || currentEdu.fieldOfStudy.trim() === "") {
        return "Please fill out the field of study";
      }
    }

    // Step 2: Additional info validation (if any fields are enabled, validate them)
    if (step === 2) {
      if (
        currentEdu.awards &&
        (!currentEdu.awardName || currentEdu.awardName.trim() === "")
      ) {
        return "Please fill out the award name";
      }
      if (
        currentEdu.academicScholarships &&
        (!currentEdu.academicScholarshipName ||
          currentEdu.academicScholarshipName.trim() === "")
      ) {
        return "Please fill out the academic scholarship name";
      }
      if (
        currentEdu.sportsScholarships &&
        (!currentEdu.sportsScholarshipName ||
          currentEdu.sportsScholarshipName.trim() === "")
      ) {
        return "Please fill out the sports scholarship name";
      }
      if (
        currentEdu.club &&
        (!currentEdu.clubName || currentEdu.clubName.trim() === "")
      ) {
        return "Please fill out the club name";
      }
    }

    return null;
  };

  const handleEduNext = (fromStep) => {
    const validationError = validateCurrentEduStep(fromStep);
    if (validationError) {
      setEduError(validationError);
      return false;
    }

    setEduError("");
    if (fromStep === 1) {
      setEduSubStep(2);
    } else if (fromStep === 2) {
      setEduSubStep(3);
    }
    return true;
  };

  const handleEduBack = () => {
    setEduError("");
    if (eduSubStep > 1) {
      setEduSubStep(eduSubStep - 1);
    } else {
      setEduSubStep(3);
    }
  };

  // Sub-step 1: Basic Education Information
  if (eduSubStep === 1) {
    const educationLevels = [
      "High School",
      "Associates",
      "Bachelors",
      "Masters",
      "PhD",
      "Professional",
      "Other",
    ];

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Tell us about your Education
            </h1>
            <p className="text-gray-400">
              Enter your education experience so far, even if you are currently
              a
              <br />
              student or did not graduate
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            1/3
          </div>
        </div>

        {eduError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {eduError}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Highest education level <span className="text-red-400">*</span>
              </label>
              <select
                id="educationLevel"
                value={currentEdu.educationLevel || "Bachelors"}
                onChange={handleEduFieldChange}
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                School name <span className="text-red-400">*</span>
              </label>
              <input
                id="schoolName"
                type="text"
                value={currentEdu.schoolName || ""}
                onChange={handleEduFieldChange}
                placeholder="Enter school name"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                School location
              </label>
              <input
                id="schoolLocation"
                type="text"
                value={currentEdu.schoolLocation || ""}
                onChange={handleEduFieldChange}
                placeholder="e.g Lagos, Nigeria"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Degree <span className="text-red-400">*</span>
              </label>
              <select
                id="degree"
                value={currentEdu.degree || ""}
                onChange={handleEduFieldChange}
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="">Select</option>
                <option value="Bachelor of Science">Bachelor of Science</option>
                <option value="Bachelor of Arts">Bachelor of Arts</option>
                <option value="Bachelor of Engineering">
                  Bachelor of Engineering
                </option>
                <option value="Master of Science">Master of Science</option>
                <option value="Master of Arts">Master of Arts</option>
                <option value="Master of Engineering">
                  Master of Engineering
                </option>
                <option value="Doctor of Philosophy">
                  Doctor of Philosophy
                </option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Field of Study <span className="text-red-400">*</span>
            </label>
            <input
              id="fieldOfStudy"
              type="text"
              value={currentEdu.fieldOfStudy || ""}
              onChange={handleEduFieldChange}
              placeholder="e.g Architecture"
              className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Graduation Date (Or Expected Graduation Date)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                id="graduationMonth"
                value={currentEdu.graduationMonth || ""}
                onChange={handleEduFieldChange}
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
              <select
                id="graduationYear"
                value={currentEdu.graduationYear || ""}
                onChange={handleEduFieldChange}
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Year</option>
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={2030 - i} value={2030 - i}>
                    {2030 - i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="currentlyStudying"
              type="checkbox"
              checked={currentEdu.currentlyStudying || false}
              onChange={handleEduFieldChange}
              className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
            />
            <label className="ml-2 text-sm text-gray-300">
              I am currently studying here
            </label>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleEduBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            {educationExperiences.length === 1 && currentEduIndex === 0
              ? "Cancel"
              : "Back to Summary"}
          </button>
          <button
            type="button"
            onClick={() => handleEduNext(1)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Sub-step 2: Additional Educational Information
  if (eduSubStep === 2) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Additional educational information
            </h1>
            <p className="text-gray-400">
              Not enough work experience? This section can help you stand out.
              If your bachelor's degree is in progress, you may
              <br />
              include educational achievements or any other certification that
              corresponds to the job you want
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            2/3
          </div>
        </div>

        {eduError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {eduError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Checkboxes */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              Choose all that apply
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  id="awards"
                  type="checkbox"
                  checked={currentEdu.awards || false}
                  onChange={handleEduFieldChange}
                  className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
                />
                <label className="text-white">Awards</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  id="academicScholarships"
                  type="checkbox"
                  checked={currentEdu.academicScholarships || false}
                  onChange={handleEduFieldChange}
                  className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
                />
                <label className="text-white">Academic Scholarships</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  id="sportsScholarships"
                  type="checkbox"
                  checked={currentEdu.sportsScholarships || false}
                  onChange={handleEduFieldChange}
                  className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
                />
                <label className="text-white">Sports Scholarships</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  id="gpa"
                  type="checkbox"
                  checked={currentEdu.gpa || false}
                  onChange={handleEduFieldChange}
                  className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
                />
                <label className="text-white">GPA</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  id="club"
                  type="checkbox"
                  checked={currentEdu.club || false}
                  onChange={handleEduFieldChange}
                  className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
                />
                <label className="text-white">Club</label>
              </div>
            </div>
          </div>

          {/* Right side - Form fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Education Description
              </h3>
              <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded">
                Save
              </button>
            </div>

            <div className="space-y-6">
              {/* Awards */}
              {currentEdu.awards && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Award
                    </label>
                    <input
                      id="awardName"
                      type="text"
                      value={currentEdu.awardName || ""}
                      onChange={handleEduFieldChange}
                      placeholder="Award name"
                      className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      School year
                    </label>
                    <input
                      id="awardYear"
                      type="text"
                      value={currentEdu.awardYear || ""}
                      onChange={handleEduFieldChange}
                      placeholder="School year award was received"
                      className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* Academic Scholarships */}
              {currentEdu.academicScholarships && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Academic scholarship
                      </label>
                      <input
                        id="academicScholarshipName"
                        type="text"
                        value={currentEdu.academicScholarshipName || ""}
                        onChange={handleEduFieldChange}
                        placeholder="Scholarship name"
                        className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Year awarded
                      </label>
                      <select
                        id="academicScholarshipYear"
                        value={currentEdu.academicScholarshipYear || ""}
                        onChange={handleEduFieldChange}
                        className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={2024 - i} value={2024 - i}>
                            {2024 - i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Awarding body
                    </label>
                    <input
                      id="academicScholarshipBody"
                      type="text"
                      value={currentEdu.academicScholarshipBody || ""}
                      onChange={handleEduFieldChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* Sports Scholarships */}
              {currentEdu.sportsScholarships && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sports scholarship
                      </label>
                      <input
                        id="sportsScholarshipName"
                        type="text"
                        value={currentEdu.sportsScholarshipName || ""}
                        onChange={handleEduFieldChange}
                        placeholder="Scholarship name"
                        className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Year awarded
                      </label>
                      <select
                        id="sportsScholarshipYear"
                        value={currentEdu.sportsScholarshipYear || ""}
                        onChange={handleEduFieldChange}
                        className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={2024 - i} value={2024 - i}>
                            {2024 - i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Awarding body
                    </label>
                    <input
                      id="sportsScholarshipBody"
                      type="text"
                      value={currentEdu.sportsScholarshipBody || ""}
                      onChange={handleEduFieldChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* GPA */}
              {currentEdu.gpa && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GPA
                  </label>
                  <input
                    id="gpaValue"
                    type="text"
                    value={currentEdu.gpaValue || ""}
                    onChange={handleEduFieldChange}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              )}

              {/* Club */}
              {currentEdu.club && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Club
                    </label>
                    <input
                      id="clubName"
                      type="text"
                      value={currentEdu.clubName || ""}
                      onChange={handleEduFieldChange}
                      placeholder="Club name"
                      className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start year
                      </label>
                      <select
                        id="clubStartYear"
                        value={currentEdu.clubStartYear || ""}
                        onChange={handleEduFieldChange}
                        className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={2024 - i} value={2024 - i}>
                            {2024 - i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End year
                      </label>
                      <select
                        id="clubEndYear"
                        value={currentEdu.clubEndYear || ""}
                        onChange={handleEduFieldChange}
                        className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={2024 - i} value={2024 - i}>
                            {2024 - i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleEduBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={() => handleEduNext(2)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Sub-step 3: Education Summary
  if (eduSubStep === 3) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Education summary
            </h1>
            <p className="text-gray-400 max-w-lg">
              An overview of your academic background, including degrees earned,
              institutions attended, and notable achievements. This summary
              highlights your educational qualifications and areas of expertise.
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            3/3
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {educationExperiences.map((edu, index) => (
            <div
              key={index}
              className="bg-transparent border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      {edu.degree || "Degree"} -{" "}
                      {edu.schoolName || "University Name"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {edu.fieldOfStudy || "Field of Study"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {edu.schoolLocation && `${edu.schoolLocation} • `}
                      Graduated in{" "}
                      {edu.graduationMonth && edu.graduationYear
                        ? `${new Date(
                            2024,
                            parseInt(edu.graduationMonth) - 1
                          ).toLocaleString("default", { month: "long" })} ${
                            edu.graduationYear
                          }`
                        : "November 2023"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => editEducation(index)}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  {educationExperiences.length > 1 && (
                    <button
                      onClick={() => deleteEducation(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {/* Show achievements if any */}
                {edu.awards ||
                edu.academicScholarships ||
                edu.sportsScholarships ||
                edu.gpa ||
                edu.club ? (
                  <div className="text-gray-300 text-sm space-y-1">
                    {edu.awards && edu.awardName && (
                      <div>Won the gold award in my 3rd year in school</div>
                    )}
                    {edu.academicScholarships &&
                      edu.academicScholarshipName && (
                        <div>
                          Was given a Academic scholarship by{" "}
                          {edu.academicScholarshipBody || "MTN"} in{" "}
                          {edu.academicScholarshipYear || "2020"}
                        </div>
                      )}
                    {edu.sportsScholarships && edu.sportsScholarshipName && (
                      <div>
                        Was given a Sports scholarship by{" "}
                        {edu.sportsScholarshipBody || "NFL"} in{" "}
                        {edu.sportsScholarshipYear || "2022"}
                      </div>
                    )}
                    {edu.club && edu.clubName && (
                      <div>
                        Was in the chess club from {edu.clubStartYear || "2021"}{" "}
                        to {edu.clubEndYear || "2023"}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    No additional achievements added yet
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => editEducation(index)}
                  className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Edit details</span>
                </button>
                <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                  <span>Show more details</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addNewEducation}
          className="w-full border-2 border-dashed border-gray-700 rounded-xl py-6 px-6 text-center hover:border-purple-500 hover:bg-gray-900/50 transition-colors mb-8"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-purple-400 text-lg">+</span>
            <span className="text-purple-400 font-medium">
              Add another degree
            </span>
          </div>
        </button>

        {/* This step uses main navigation buttons */}
      </div>
    );
  }

  return null;
};

// Step 4: Skills
const SkillsStep = ({ formData, handleChange, error }) => {
  const skills = formData.skills || [""];

  const updateSkill = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    handleChange({ target: { id: "skills", value: newSkills } });
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    handleChange({ target: { id: "skills", value: newSkills } });
  };

  const addSkill = () => {
    handleChange({ target: { id: "skills", value: [...skills, ""] } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          What interests/Hobbies do you have
        </h1>
        <p className="text-gray-400 mb-2">
          List the software tools and programs you're proficient in, from
          productivity suites to
          <br />
          specialized software relevant to your field.
        </p>
        <p className="text-gray-300 text-sm">We recommend 6 to 12 skills</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                placeholder={index === 0 ? "Chess" : "Enter here"}
                className="flex-1 px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="p-3 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSkill}
          className="w-full border-2 border-dashed border-gray-700 rounded-xl py-4 px-6 text-center hover:border-purple-500 hover:bg-gray-900/50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-purple-400 text-lg">+</span>
            <span className="text-purple-400 font-medium">
              Add another interest
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

// Step 5: Certifications
const CertificationsStep = ({ formData, handleChange, error }) => {
  const certificates = formData.certificates || [{ title: "", link: "" }];

  const updateCertificate = (index, field, value) => {
    const newCertificates = [...certificates];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    handleChange({ target: { id: "certificates", value: newCertificates } });
  };

  const removeCertificate = (index) => {
    const newCertificates = certificates.filter((_, i) => i !== index);
    handleChange({ target: { id: "certificates", value: newCertificates } });
  };

  const addCertificate = () => {
    handleChange({
      target: {
        id: "certificates",
        value: [...certificates, { title: "", link: "" }],
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Do you have any certificates?
          </h1>
          <p className="text-gray-400">
            Upload any online certificates you might have been given (i.e
            bootcamps, internships, udemy, coursera etc)
          </p>
        </div>
        <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
          1/2
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {certificates.map((certificate, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-transparent rounded-xl"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={certificate.title}
                onChange={(e) =>
                  updateCertificate(index, "title", e.target.value)
                }
                placeholder="Title of certificate"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Add Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={certificate.link}
                  onChange={(e) =>
                    updateCertificate(index, "link", e.target.value)
                  }
                  placeholder="Paste link"
                  className="flex-1 px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {certificates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCertificate(index)}
                    className="p-3 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCertificate}
          className="w-full border-2 border-dashed border-gray-700 rounded-xl py-4 px-6 text-center hover:border-purple-500 hover:bg-gray-900/50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-purple-400 text-lg">+</span>
            <span className="text-purple-400 font-medium">
              Add another certificate
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

// Step 6: Projects (Multi-step)
const ProjectsStep = ({ formData, handleChange, error }) => {
  const [projectSubStep, setProjectSubStep] = useState(2); // Start at summary
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [projectError, setProjectError] = useState(""); // Local error state

  // Initialize projects array if it doesn't exist
  const projects = formData.projects || [
    {
      projectTitle: "",
      projectType: "",
      projectLink: "",
      projectDescription: "",
    },
  ];

  // If there's no data in the first project, start at step 1
  useEffect(() => {
    const firstProject = projects[0];
    if (!firstProject.projectTitle && !firstProject.projectDescription) {
      setProjectSubStep(1);
    }
  }, []);

  const currentProject = projects[currentProjectIndex] || projects[0];

  const updateCurrentProject = (field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[currentProjectIndex] = {
      ...updatedProjects[currentProjectIndex],
      [field]: value,
    };
    handleChange({ target: { id: "projects", value: updatedProjects } });
    // Clear error when user starts typing
    if (projectError) setProjectError("");
  };

  const handleProjectFieldChange = (e) => {
    const { id, value, type, checked } = e.target;
    updateCurrentProject(id, type === "checkbox" ? checked : value);
  };

  const addNewProject = () => {
    const newProject = {
      projectTitle: "",
      projectType: "",
      projectLink: "",
      projectDescription: "",
    };
    const updatedProjects = [...projects, newProject];
    handleChange({ target: { id: "projects", value: updatedProjects } });
    setCurrentProjectIndex(updatedProjects.length - 1);
    setProjectSubStep(1);
    setProjectError("");
  };

  const deleteProject = (index) => {
    if (projects.length > 1) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      handleChange({ target: { id: "projects", value: updatedProjects } });

      if (currentProjectIndex >= updatedProjects.length) {
        setCurrentProjectIndex(updatedProjects.length - 1);
      }

      if (currentProjectIndex === index) {
        setProjectSubStep(2);
      }
    }
  };

  const editProject = (index) => {
    setCurrentProjectIndex(index);
    setProjectSubStep(1);
    setProjectError("");
  };

  const validateCurrentProject = () => {
    if (
      !currentProject.projectTitle ||
      currentProject.projectTitle.trim() === ""
    ) {
      return "Please fill out the project title field";
    }
    if (
      !currentProject.projectDescription ||
      currentProject.projectDescription.trim() === ""
    ) {
      return "Please fill out the project description field";
    }
    return null;
  };

  const handleProjectNext = () => {
    const validationError = validateCurrentProject();
    if (validationError) {
      setProjectError(validationError);
      return false;
    }

    setProjectError("");
    setProjectSubStep(2);
    return true;
  };

  const handleProjectBack = () => {
    setProjectError("");
    setProjectSubStep(2);
  };

  // Sub-step 1: Project Form
  if (projectSubStep === 1) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Tell us about the Projects you've worked on
            </h1>
            <p className="text-gray-400">
              You can include any personal projects, contract, volunteer or
              freelance projects
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            1/2
          </div>
        </div>

        {projectError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {projectError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project title <span className="text-red-400">*</span>
              </label>
              <input
                id="projectTitle"
                type="text"
                value={currentProject.projectTitle || ""}
                onChange={handleProjectFieldChange}
                placeholder="e.g Fitness app"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project type
              </label>
              <input
                id="projectType"
                type="text"
                value={currentProject.projectType || ""}
                onChange={handleProjectFieldChange}
                placeholder="e.g Freelance"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project link
              </label>
              <input
                id="projectLink"
                type="url"
                value={currentProject.projectLink || ""}
                onChange={handleProjectFieldChange}
                placeholder="Paste project link"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Right side - Project description */}
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project description <span className="text-red-400">*</span>
              </label>
              <RichTextEditor
                value={currentProject.projectDescription || ""}
                onChange={(value) =>
                  updateCurrentProject("projectDescription", value)
                }
                placeholder="Tell us about the project"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleProjectBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            {projects.length === 1 && currentProjectIndex === 0
              ? "Cancel"
              : "Back to Summary"}
          </button>
          <button
            type="button"
            onClick={handleProjectNext}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Sub-step 2: Projects Summary
  if (projectSubStep === 2) {
    return (
      <div className="max-w-4xl mx-auto">
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
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            2/2
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-transparent border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white text-lg font-semibold">
                        {project.projectTitle || "Project Title"}
                      </h3>
                      {project.projectType && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400 text-sm">
                            {project.projectType}
                          </span>
                        </>
                      )}
                    </div>
                    {project.projectLink && (
                      <div className="mt-1">
                        <span className="text-gray-500 text-xs">
                          Project link:{" "}
                        </span>
                        <a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 text-xs hover:text-purple-300 underline"
                        >
                          {project.projectLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => editProject(index)}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => deleteProject(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                {project.projectDescription ? (
                  <div className="text-gray-300 text-sm">
                    {project.projectDescription.length > 200
                      ? `${project.projectDescription.substring(0, 200)}...`
                      : project.projectDescription}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    No project description added yet
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => editProject(index)}
                  className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Edit project</span>
                </button>
                {project.projectDescription &&
                  project.projectDescription.length > 200 && (
                    <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                      <span>Show more details</span>
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addNewProject}
          className="w-full border-2 border-dashed border-gray-700 rounded-xl py-6 px-6 text-center hover:border-purple-500 hover:bg-gray-900/50 transition-colors mb-8"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-purple-400 text-lg">+</span>
            <span className="text-purple-400 font-medium">
              Add another Project
            </span>
          </div>
        </button>

        {/* This step uses main navigation buttons */}
      </div>
    );
  }

  return null;
};

// Step 7: Finalize (Multi-step)
// Step 7: Finalize (Multi-step)
const FinalizeStep = ({ formData, handleChange, error }) => {
  const [finalizeSubStep, setFinalizeSubStep] = useState(1);
  const [interests, setInterests] = useState(formData.interests || [""]);
  const [softwareSkills, setSoftwareSkills] = useState(
    formData.softwareSkills || [""]
  );
  const [finalizeError, setFinalizeError] = useState("");

  // Sync local state with formData
  useEffect(() => {
    setInterests(formData.interests || [""]);
    setSoftwareSkills(formData.softwareSkills || [""]);
  }, [formData.interests, formData.softwareSkills]);

  const updateInterest = (index, value) => {
    const newInterests = [...interests];
    newInterests[index] = value;
    setInterests(newInterests);
    handleChange({ target: { id: "interests", value: newInterests } });
  };

  const addInterest = () => {
    setInterests([...interests, ""]);
  };

  const removeInterest = (index) => {
    const newInterests = interests.filter((_, i) => i !== index);
    setInterests(newInterests);
    handleChange({ target: { id: "interests", value: newInterests } });
  };

  const updateSoftwareSkill = (index, value) => {
    const newSkills = [...softwareSkills];
    newSkills[index] = value;
    setSoftwareSkills(newSkills);
    handleChange({ target: { id: "softwareSkills", value: newSkills } });
  };

  const addSoftwareSkill = () => {
    setSoftwareSkills([...softwareSkills, ""]);
  };

  const removeSoftwareSkill = (index) => {
    const newSkills = softwareSkills.filter((_, i) => i !== index);
    setSoftwareSkills(newSkills);
    handleChange({ target: { id: "softwareSkills", value: newSkills } });
  };

  const handleFinalizeNext = () => {
    setFinalizeError("");
    if (finalizeSubStep < 5) {
      setFinalizeSubStep(finalizeSubStep + 1);
    }
  };

  const handleFinalizeBack = () => {
    setFinalizeError("");
    if (finalizeSubStep > 1) {
      setFinalizeSubStep(finalizeSubStep - 1);
    }
  };

  const handleSkip = () => {
    if (finalizeSubStep < 5) {
      setFinalizeSubStep(finalizeSubStep + 1);
    }
  };

  // Sub-step 1: Links
  if (finalizeSubStep === 1) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              What do you want to link to?
            </h1>
            <p className="text-gray-400">
              Include links to portfolios or social media. In your resume, this
              can help
              <br />
              employers get to know you better.
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            1/5
          </div>
        </div>

        {finalizeError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {finalizeError}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                id="website"
                type="url"
                value={formData.website || ""}
                onChange={handleChange}
                placeholder="Paste link"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Linkedin
              </label>
              <input
                id="linkedin"
                type="url"
                value={formData.linkedin || ""}
                onChange={handleChange}
                placeholder="Paste link"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Behance
              </label>
              <input
                id="behance"
                type="url"
                value={formData.behance || ""}
                onChange={handleChange}
                placeholder="Paste link"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Any other relevant link
              </label>
              <input
                id="otherLink"
                type="url"
                value={formData.otherLink || ""}
                onChange={handleChange}
                placeholder="Paste link"
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleSkip}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleFinalizeNext}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Sub-step 2: Professional Summary
  if (finalizeSubStep === 2) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Give us a brief summary of your background
            </h1>
            <p className="text-gray-400">
              Add anything else you want employers to know. Highlight any unique
              skills, experiences,
              <br />
              or achievements that set you apart, showcase your passion, or
              explain your career goals.
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            2/5
          </div>
        </div>

        {finalizeError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {finalizeError}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Background Description
            </label>
            <div className="bg-transparent border border-gray-700 rounded-xl">
              <textarea
                id="summary"
                value={formData.summary || ""}
                onChange={handleChange}
                placeholder="I am a Creative UI/UX designer with [number] years facilitating and supporting human interactions with complex systems and software. Maintains user-centric designs while adhering to prescribed interface principals and related development goals. Dedicated to creating inviting and unintimidating interfaces for everything from simple open-source applications to complex proprietary systems."
                rows={8}
                className="w-full p-4 text-white bg-transparent focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4 font-bold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white italic">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a1 1 0 012 0v1h8V4a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h1V4z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                    AB
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9.5H17a1 1 0 110 2h-5.586l4.293 4.293a1 1 0 010 1.414z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleFinalizeBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Go back
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleFinalizeNext}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sub-step 3: Software Skills
  if (finalizeSubStep === 3) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              What Software skills do you have?
            </h1>
            <p className="text-gray-400 mb-2">
              List the software tools and programs you're proficient in, from
              productivity suites
              <br />
              to specialized software relevant to your field.
            </p>
            <p className="text-gray-300 text-sm">We recommend 6 to 12 skills</p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            3/5
          </div>
        </div>

        {finalizeError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {finalizeError}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {softwareSkills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSoftwareSkill(index, e.target.value)}
                  placeholder={
                    index === 0
                      ? "Figma"
                      : index === 1
                      ? "Sketch"
                      : index === 2
                      ? "Adobe XD"
                      : index === 3
                      ? "Blender"
                      : index === 4
                      ? "Spline"
                      : "Enter here"
                  }
                  className="flex-1 px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {softwareSkills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSoftwareSkill(index)}
                    className="p-3 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSoftwareSkill}
            className="w-full border-2 border-dashed border-gray-700 rounded-xl py-4 px-6 text-center hover:border-purple-500 hover:bg-gray-900/50 transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-purple-400 text-lg">+</span>
              <span className="text-purple-400 font-medium">
                Add another skill
              </span>
            </div>
          </button>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleFinalizeBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Go back
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleFinalizeNext}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sub-step 4: Interests/Hobbies
  if (finalizeSubStep === 4) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              What interests/Hobbies do you have
            </h1>
            <p className="text-gray-400">
              List the software tools and programs you're proficient in, from
              productivity suites to
              <br />
              specialized software relevant to your field.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              We recommend 6 to 12 skills
            </p>
          </div>
          <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            4/5
          </div>
        </div>

        {finalizeError && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            {finalizeError}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interests.map((interest, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => updateInterest(index, e.target.value)}
                  placeholder={index === 0 ? "Chess" : "Enter here"}
                  className="flex-1 px-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {interests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="p-3 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addInterest}
            className="w-full border-2 border-dashed border-gray-700 rounded-xl py-4 px-6 text-center hover:border-purple-500 hover:bg-gray-900/50 transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-purple-400 text-lg">+</span>
              <span className="text-purple-400 font-medium">
                Add another interest
              </span>
            </div>
          </button>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleFinalizeBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Go back
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleFinalizeNext}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Finalize
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sub-step 5: Completion
  if (finalizeSubStep === 5) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-white">
                  Your resume has been completed
                </h1>
                <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  5/5
                </div>
              </div>
              <p className="text-gray-400 mb-8">
                Would you like to enhance it with AI or add more details?
              </p>

              <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors mb-6 flex items-center justify-center space-x-2">
                <span>✨</span>
                <span>Enhance with AI</span>
              </button>

              {finalizeError && (
                <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
                  {finalizeError}
                </div>
              )}
            </div>
          </div>

          <div>
            <TemplatePreview formData={formData} />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleFinalizeBack}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Go back
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Complete Resume
          </button>
        </div>
      </div>
    );
  }

  return null;
};

// Form validation functions
const validatePersonalInfo = (formData) => {
  const requiredFields = ["firstName", "lastName", "jobTitle", "email"];

  for (const field of requiredFields) {
    if (!formData[field] || formData[field].trim() === "") {
      return `Please fill out the ${field
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()} field`;
    }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.email)) {
    return "Please enter a valid email address";
  }

  return null;
};

const validateWorkHistory = (formData) => {
  const workExperiences = formData.workExperiences || [];

  if (workExperiences.length === 0) {
    return "Please add at least one work experience";
  }

  for (let i = 0; i < workExperiences.length; i++) {
    const work = workExperiences[i];
    const requiredFields = ["workJobTitle", "employer"];

    for (const field of requiredFields) {
      if (!work[field] || work[field].trim() === "") {
        const fieldName = field === "workJobTitle" ? "job title" : "employer";
        return `Please fill out the ${fieldName} field for work experience #${
          i + 1
        }`;
      }
    }

    // Check if job description is filled for at least the first work experience
    if (
      i === 0 &&
      (!work.jobDescription || work.jobDescription.trim() === "")
    ) {
      return "Please fill out the job description for your most recent work experience";
    }
  }

  return null;
};

const validateEducation = (formData) => {
  const educationExperiences = formData.educationExperiences || [];

  if (educationExperiences.length === 0) {
    return "Please add at least one education experience";
  }

  for (let i = 0; i < educationExperiences.length; i++) {
    const edu = educationExperiences[i];
    const requiredFields = ["schoolName", "degree", "fieldOfStudy"];

    for (const field of requiredFields) {
      if (!edu[field] || edu[field].trim() === "") {
        const fieldName =
          field === "schoolName"
            ? "school name"
            : field === "fieldOfStudy"
            ? "field of study"
            : field;
        return `Please fill out the ${fieldName} field for education #${i + 1}`;
      }
    }
  }

  return null;
};

const validateSkills = (formData) => {
  const skills = formData.skills || [];

  if (skills.length === 0 || (skills.length === 1 && skills[0].trim() === "")) {
    return "Please add at least one skill";
  }

  return null;
};

const validateProjects = (formData) => {
  const projects = formData.projects || [];
  if (projects.length === 0) {
    return "Please add at least one project";
  }
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (!project.projectTitle || project.projectTitle.trim() === "") {
      return `Please fill out the project title for project #${i + 1}`;
    }
    if (
      !project.projectDescription ||
      project.projectDescription.trim() === ""
    ) {
      return `Please fill out the project description for project #${i + 1}`;
    }
  }
  return null;
};
const validateCertifications = (formData) => {
  const certificates = formData.certificates || [];

  for (let i = 0; i < certificates.length; i++) {
    const cert = certificates[i];
    if (
      cert.title &&
      cert.title.trim() !== "" &&
      cert.link &&
      !/^(ftp|http|https):\/\/[^ "]+$/.test(cert.link)
    ) {
      return `Please enter a valid URL for certificate #${i + 1}`;
    }
  }

  return null;
};

// Main Component
const ResumeBuilderPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Consolidated form data state
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    jobTitle: "",
    languages: "",
    district: "",
    cityCountry: "",
    postalCode: "",
    phone: "",
    email: "",

    // Work History - now uses an array of work experiences
    workExperiences: [
      {
        workJobTitle: "",
        employer: "",
        workLocation: "",
        jobType: "Full time",
        workMode: "Remote",
        workStartMonth: "",
        workStartYear: "",
        workEndMonth: "",
        workEndYear: "",
        currentlyWorking: false,
        jobDescription: "",
      },
    ],

    // Education - now uses an array of education experiences
    educationExperiences: [
      {
        educationLevel: "Bachelors",
        schoolName: "",
        schoolLocation: "",
        degree: "",
        fieldOfStudy: "",
        graduationMonth: "",
        graduationYear: "",
        currentlyStudying: false,
        // Additional info
        awards: false,
        awardName: "",
        awardYear: "",
        academicScholarships: false,
        academicScholarshipName: "",
        academicScholarshipYear: "",
        academicScholarshipBody: "",
        sportsScholarships: false,
        sportsScholarshipName: "",
        sportsScholarshipYear: "",
        sportsScholarshipBody: "",
        gpa: false,
        gpaValue: "",
        club: false,
        clubName: "",
        clubStartYear: "",
        clubEndYear: "",
      },
    ],

    // Skills
    skills: [""],

    // Certifications
    certificates: [{ title: "", link: "" }],

    projects: [
      {
        projectTitle: "",
        projectType: "",
        projectLink: "",
        projectDescription: "",
      },
    ],
    // Finalize - expanded with new sections
    summary: "",
    interests: [""],
    references: [{ name: "", relationship: "", contact: "" }],
    additionalLinks: [{ label: "", url: "" }],
    website: "",
    linkedin: "",
  });
  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return validatePersonalInfo(formData);
      case 2:
        return validateWorkHistory(formData);
      case 3:
        return validateEducation(formData);
      case 4:
        return validateSkills(formData);
      case 5:
        return validateCertifications(formData);
      case 6:
        return validateProjects(formData);
      case 7:
        return null; // Finalize step is optional
      default:
        return null;
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    setError("");

    // Special handling for work history step
    if (currentStep === 2) {
      // Validate work history - ensure at least one complete work experience
      const validationError = validateCurrentStep();
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      // Work history validation passed, move to next step
      setCurrentStep(3);
      setIsLoading(false);
      return;
    }

    // Special handling for education step
    if (currentStep === 3) {
      // Validate education - ensure at least one complete education experience
      const validationError = validateCurrentStep();
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      // Education validation passed, move to next step
      setCurrentStep(4);
      setIsLoading(false);
      return;
    }

    // Validate current step for other steps
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      } else {
        // Completed - show completion message
        alert("Resume completed successfully!");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Failed to save your information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        );
      case 2:
        return (
          <WorkHistoryStep
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        );
      case 3:
        return (
          <EducationStep
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        );
      case 4:
        return (
          <SkillsStep
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        );
      case 5:
        return (
          <CertificationsStep
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        );
      case 6:
        return (
          <ProjectsStep
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        );
      case 7:
        return (
          <FinalizeStep
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        );
      default:
        return (
          <PersonalInfoStep
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        );
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center bg-black">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative bg-black">
      {/* Rising sun effect at bottom center */}
      <div
        className="fixed -bottom-64 left-1/2 transform -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-t from-purple-500/40 via-purple-600/30 to-purple-800/20 rounded-full"
        style={{ filter: "blur(150px)" }}
      ></div>

      {/* Content - higher z-index to ensure it's above background */}
      <div className="relative z-20">
        <main className="container mx-auto px-6 py-8">
          <ProgressSteps currentStep={currentStep} />

          {renderCurrentStep()}

          {/* Navigation Buttons - Show for all steps, but handle work history differently */}
          <div className="flex justify-between items-center mt-12">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Go back
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePreview}
                className="px-6 py-3 border border-purple-600 text-purple-400 rounded-xl hover:bg-purple-600 hover:text-white transition-colors"
              >
                Preview Resume
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Saving..."
                  : currentStep === 7
                  ? "Complete"
                  : "Next"}
              </button>
            </div>
          </div>
          {/* Preview Modal */}
          <ResumePreviewModal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            formData={formData}
          />
        </main>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
