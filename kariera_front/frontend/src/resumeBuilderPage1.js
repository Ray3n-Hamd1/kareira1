import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  savePersonalInfo,
  saveWorkHistory,
  saveEducation,
  saveSkills,
  saveCertifications,
  saveProjects,
  getUserResume,
} from "../../services/resumeService";

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

  // Calculate progress percentage based on current step
  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="mb-8">
      {/* Steps Row - All in One Big Oval Container */}
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="flex items-center justify-between flex-1 mr-6 bg-gray-800 rounded-full px-2 py-2 overflow-x-auto">
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

// Template Preview Component
const TemplatePreview = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-2">
        Current Template
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        You can view different templates and select the one you love best
      </p>

      {/* Template Preview Area */}
      <div className="bg-gray-900 rounded-lg h-96 mb-6 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Template Preview</div>
      </div>

      <button className="w-full py-2 px-4 border-2 border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
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
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const handleButtonClick = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg">
      <div
        contentEditable
        className="min-h-[150px] p-4 text-white focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value || "" }}
        onInput={(e) => onChange(e.target.innerHTML)}
        onPaste={handlePaste}
        placeholder={placeholder}
        style={{ whiteSpace: "pre-wrap" }}
      />

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-600">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleButtonClick("bold")}
            className="p-2 text-gray-400 hover:text-white rounded"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("italic")}
            className="p-2 text-gray-400 hover:text-white rounded"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("underline")}
            className="p-2 text-gray-400 hover:text-white rounded"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("insertOrderedList")}
            className="p-2 text-gray-400 hover:text-white rounded"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 1: Personal Information
const PersonalInfoStep = ({ formData, handleChange, error, validateStep }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column - Form */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          What's the best way for employers to contact you?
        </h1>
        <p className="text-gray-400 mb-8">
          Including an email and phone number is advisable
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Name Fields */}
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Job Title */}
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
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Languages */}
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
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Location Fields */}
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contact Fields */}
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Template Preview */}
      <div>
        <TemplatePreview />
      </div>
    </div>
  );
};

// Step 2: Work History
const WorkHistoryStep = ({ formData, handleChange, error }) => {
  const handleWorkModeChange = (mode) => {
    handleChange({ target: { id: "workMode", value: mode } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Tell us about your most recent job
          </h1>
          <p className="text-gray-400">
            You can include any work experience, internships, scholarships,
            <br />
            relevant coursework and academic achievements.
          </p>
        </div>
        <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
          1/3
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
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
              value={formData.workJobTitle || ""}
              onChange={handleChange}
              placeholder="e.g UI/UX Designer"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              value={formData.employer || ""}
              onChange={handleChange}
              placeholder="e.g Grey finance"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              value={formData.workLocation || ""}
              onChange={handleChange}
              placeholder="e.g Lagos, Nigeria"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job type
            </label>
            <select
              id="jobType"
              value={formData.jobType || "Full time"}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
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
          <div className="flex items-center space-x-4 mt-4">
            {["Remote", "Onsite", "Hybrid"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleWorkModeChange(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.workMode === mode
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                ✓ {mode}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Description <span className="text-red-400">*</span>
          </label>
          <RichTextEditor
            value={formData.jobDescription || ""}
            onChange={(value) =>
              handleChange({ target: { id: "jobDescription", value } })
            }
            placeholder="Describe your role and responsibilities..."
          />
        </div>

        <div className="flex items-center">
          <input
            id="currentlyWorking"
            type="checkbox"
            checked={formData.currentlyWorking || false}
            onChange={(e) =>
              handleChange({
                target: {
                  id: "currentlyWorking",
                  value: e.target.checked,
                  type: "checkbox",
                  checked: e.target.checked,
                },
              })
            }
            className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
          />
          <label className="ml-2 text-sm text-gray-300">
            I currently work here
          </label>
        </div>
      </div>
    </div>
  );
};

// Step 3: Education
const EducationStep = ({ formData, handleChange, error }) => {
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
            Enter your education experience so far, even if you are currently a
            <br />
            student or did not graduate
          </p>
        </div>
        <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
          1/3
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
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
              value={formData.educationLevel || "Bachelors"}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              value={formData.schoolName || ""}
              onChange={handleChange}
              placeholder="Enter school name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              value={formData.schoolLocation || ""}
              onChange={handleChange}
              placeholder="e.g Lagos, Nigeria"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Degree <span className="text-red-400">*</span>
            </label>
            <input
              id="degree"
              type="text"
              value={formData.degree || ""}
              onChange={handleChange}
              placeholder="e.g Bachelor of Science"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Field of Study <span className="text-red-400">*</span>
          </label>
          <input
            id="fieldOfStudy"
            type="text"
            value={formData.fieldOfStudy || ""}
            onChange={handleChange}
            placeholder="e.g Architecture"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            id="currentlyStudying"
            type="checkbox"
            checked={formData.currentlyStudying || false}
            onChange={(e) =>
              handleChange({
                target: {
                  id: "currentlyStudying",
                  value: e.target.checked,
                  type: "checkbox",
                  checked: e.target.checked,
                },
              })
            }
            className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-600"
          />
          <label className="ml-2 text-sm text-gray-300">
            I am currently studying here
          </label>
        </div>
      </div>
    </div>
  );
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
          What skills would you like to highlight
        </h1>
        <p className="text-gray-400 mb-2">
          Employers scan skills for relevant keywords. Write down skills that
          are relevant
          <br />
          to your profession
        </p>
        <p className="text-gray-300 text-sm">We recommend 6 to 12 skills</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
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
                placeholder={index === 0 ? "Prototyping" : "Enter skill"}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="p-3 text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded-lg transition-colors"
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
          className="border-2 border-dashed border-gray-600 rounded-lg py-4 px-6 text-center hover:border-purple-500 hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-purple-400 text-lg">+</span>
            <span className="text-purple-400 font-medium">
              Add another skill
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
        <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
          1/2
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {certificates.map((certificate, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg"
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {certificates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCertificate(index)}
                    className="p-3 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
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
          className="border-2 border-dashed border-gray-600 rounded-lg py-4 px-6 text-center hover:border-purple-500 hover:bg-gray-800/50 transition-colors"
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

// Step 6: Projects
const ProjectsStep = ({ formData, handleChange, error }) => {
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
        <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
          1/2
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project title <span className="text-red-400">*</span>
            </label>
            <input
              id="projectTitle"
              type="text"
              value={formData.projectTitle || ""}
              onChange={handleChange}
              placeholder="e.g Fitness app"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              value={formData.projectType || ""}
              onChange={handleChange}
              placeholder="e.g Freelance"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project link
          </label>
          <input
            id="projectLink"
            type="url"
            value={formData.projectLink || ""}
            onChange={handleChange}
            placeholder="Paste project link"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project description <span className="text-red-400">*</span>
          </label>
          <RichTextEditor
            value={formData.projectDescription || ""}
            onChange={(value) =>
              handleChange({ target: { id: "projectDescription", value } })
            }
            placeholder="Tell us about the project"
          />
        </div>
      </div>
    </div>
  );
};

// Step 7: Finalize
const FinalizeStep = ({ formData, handleChange, error }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4">
              Your resume has been completed
            </h1>
            <p className="text-gray-400 mb-8">
              Would you like to enhance it with AI?
            </p>

            <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mb-6 flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>Enhance with AI</span>
            </button>

            {error && (
              <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-6">
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin || ""}
                  onChange={handleChange}
                  placeholder="Paste link"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <TemplatePreview />
        </div>
      </div>
    </div>
  );
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

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.email)) {
    return "Please enter a valid email address";
  }

  return null;
};

const validateWorkHistory = (formData) => {
  const requiredFields = ["workJobTitle", "employer", "jobDescription"];

  for (const field of requiredFields) {
    if (!formData[field] || formData[field].trim() === "") {
      const fieldName =
        field === "workJobTitle"
          ? "job title"
          : field === "jobDescription"
          ? "job description"
          : field;
      return `Please fill out the ${fieldName} field`;
    }
  }

  return null;
};

const validateEducation = (formData) => {
  const requiredFields = ["schoolName", "degree", "fieldOfStudy"];

  for (const field of requiredFields) {
    if (!formData[field] || formData[field].trim() === "") {
      const fieldName =
        field === "schoolName"
          ? "school name"
          : field === "fieldOfStudy"
          ? "field of study"
          : field;
      return `Please fill out the ${fieldName} field`;
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
  const requiredFields = ["projectTitle", "projectDescription"];

  for (const field of requiredFields) {
    if (!formData[field] || formData[field].trim() === "") {
      const fieldName =
        field === "projectTitle" ? "project title" : "project description";
      return `Please fill out the ${fieldName} field`;
    }
  }

  return null;
};

// Main Component
const ResumeBuilderPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

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

    // Work History
    workJobTitle: "",
    employer: "",
    workLocation: "",
    jobType: "Full time",
    workMode: "Remote",
    currentlyWorking: false,
    jobDescription: "",

    // Education
    educationLevel: "Bachelors",
    schoolName: "",
    schoolLocation: "",
    degree: "",
    fieldOfStudy: "",
    currentlyStudying: false,

    // Skills
    skills: [""],

    // Certifications
    certificates: [{ title: "", link: "" }],

    // Projects
    projectTitle: "",
    projectType: "",
    projectLink: "",
    projectDescription: "",

    // Finalize
    website: "",
    linkedin: "",
  });

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && Object.keys(resumeData).length > 0) {
          // Handle personal info
          if (resumeData.personalInfo) {
            const personalInfo = resumeData.personalInfo;
            setFormData((prevData) => ({
              ...prevData,
              firstName:
                personalInfo.firstName ||
                personalInfo.fullName?.split(" ")[0] ||
                "",
              lastName:
                personalInfo.lastName ||
                personalInfo.fullName?.split(" ").slice(1).join(" ") ||
                "",
              jobTitle: personalInfo.jobTitle || "",
              languages: personalInfo.languages || "",
              district: personalInfo.district || "",
              cityCountry:
                personalInfo.cityCountry || personalInfo.address || "",
              postalCode: personalInfo.postalCode || "",
              phone: personalInfo.phone || "",
              email: personalInfo.email || "",
            }));
          }

          // Handle work history
          if (resumeData.workHistory) {
            setFormData((prevData) => ({
              ...prevData,
              workJobTitle: resumeData.workHistory.jobTitle || "",
              employer: resumeData.workHistory.employer || "",
              workLocation: resumeData.workHistory.location || "",
              jobType: resumeData.workHistory.jobType || "Full time",
              workMode: resumeData.workHistory.workMode || "Remote",
              currentlyWorking:
                resumeData.workHistory.currentlyWorking || false,
              jobDescription: resumeData.workHistory.jobDescription || "",
            }));
          }

          // Handle education
          if (resumeData.education) {
            setFormData((prevData) => ({
              ...prevData,
              educationLevel:
                resumeData.education.educationLevel || "Bachelors",
              schoolName: resumeData.education.schoolName || "",
              schoolLocation: resumeData.education.schoolLocation || "",
              degree: resumeData.education.degree || "",
              fieldOfStudy: resumeData.education.fieldOfStudy || "",
              currentlyStudying:
                resumeData.education.currentlyStudying || false,
            }));
          }

          // Handle skills
          if (resumeData.skills && Array.isArray(resumeData.skills)) {
            setFormData((prevData) => ({
              ...prevData,
              skills: resumeData.skills.length > 0 ? resumeData.skills : [""],
            }));
          }

          // Handle certifications
          if (
            resumeData.certifications &&
            Array.isArray(resumeData.certifications)
          ) {
            setFormData((prevData) => ({
              ...prevData,
              certificates:
                resumeData.certifications.length > 0
                  ? resumeData.certifications
                  : [{ title: "", link: "" }],
            }));
          }

          // Handle projects
          if (resumeData.projects) {
            setFormData((prevData) => ({
              ...prevData,
              projectTitle: resumeData.projects.projectTitle || "",
              projectType: resumeData.projects.projectType || "",
              projectLink: resumeData.projects.projectLink || "",
              projectDescription: resumeData.projects.projectDescription || "",
            }));
          }

          // Handle social links
          if (resumeData.links) {
            setFormData((prevData) => ({
              ...prevData,
              website: resumeData.links.website || "",
              linkedin: resumeData.links.linkedin || "",
            }));
          }
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

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
        // Certifications are optional
        return null;
      case 6:
        return validateProjects(formData);
      case 7:
        // Finalize step is optional
        return null;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    setLoading(true);
    setError("");

    // Validate current step
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Save current step data
      switch (currentStep) {
        case 1:
          const personalInfoToSave = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            jobTitle: formData.jobTitle,
            languages: formData.languages,
            district: formData.district,
            cityCountry: formData.cityCountry,
            address: formData.cityCountry, // For backward compatibility
            postalCode: formData.postalCode,
            phone: formData.phone,
            email: formData.email,
          };
          await savePersonalInfo(personalInfoToSave);
          break;
        case 2:
          await saveWorkHistory({
            jobTitle: formData.workJobTitle,
            employer: formData.employer,
            location: formData.workLocation,
            jobType: formData.jobType,
            workMode: formData.workMode,
            currentlyWorking: formData.currentlyWorking,
            jobDescription: formData.jobDescription,
          });
          break;
        case 3:
          await saveEducation({
            educationLevel: formData.educationLevel,
            schoolName: formData.schoolName,
            schoolLocation: formData.schoolLocation,
            degree: formData.degree,
            fieldOfStudy: formData.fieldOfStudy,
            currentlyStudying: formData.currentlyStudying,
          });
          break;
        case 4:
          await saveSkills(
            formData.skills.filter((skill) => skill.trim() !== "")
          );
          break;
        case 5:
          await saveCertifications(
            formData.certificates.filter((cert) => cert.title.trim() !== "")
          );
          break;
        case 6:
          await saveProjects({
            projectTitle: formData.projectTitle,
            projectType: formData.projectType,
            projectLink: formData.projectLink,
            projectDescription: formData.projectDescription,
          });
          break;
        case 7:
          // Save social links
          const links = {
            website: formData.website,
            linkedin: formData.linkedin,
          };
          // In a real app, you would need a function to save these links
          // For now, we'll just console.log them
          console.log("Social links:", links);
          break;
        default:
          break;
      }

      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      } else {
        // Completed - redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Failed to save your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handlePreview = () => {
    navigate("/resume/preview");
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

  if (!isLoaded) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="container mx-auto px-6 py-8">
        <ProgressSteps currentStep={currentStep} />

        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12">
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
              {loading ? "Saving..." : currentStep === 7 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilderPage;
