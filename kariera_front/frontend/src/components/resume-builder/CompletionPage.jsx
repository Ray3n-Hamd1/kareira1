import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserResume, enhanceWithAI } from "../../services/resumeService";

// Template Preview Component
const TemplatePreview = ({ onChangeTemplate }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      {/* Resume Preview Area */}
      <div className="bg-white rounded-lg h-96 mb-6 flex items-center justify-center relative overflow-hidden">
        {/* Mock resume content */}
        <div className="w-full h-full p-4 text-black text-xs">
          <div className="mb-3">
            <h2 className="text-sm font-bold">John Doe</h2>
            <p className="text-xs text-gray-600">UI/UX Designer</p>
          </div>
          <div className="space-y-2">
            <div>
              <h3 className="text-xs font-semibold border-b border-gray-300 pb-1">
                Experience
              </h3>
              <div className="mt-1">
                <p className="text-xs font-medium">
                  UI/UX Designer - Grey Finance
                </p>
                <p className="text-xs text-gray-600">
                  Lagos, Nigeria | 2023-2024
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold border-b border-gray-300 pb-1">
                Education
              </h3>
              <div className="mt-1">
                <p className="text-xs font-medium">
                  Bachelor of Science - Architecture
                </p>
                <p className="text-xs text-gray-600">University of Ibadan</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold border-b border-gray-300 pb-1">
                Skills
              </h3>
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                  Prototyping
                </span>
                <span className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                  Wireframing
                </span>
                <span className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                  Figma
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onChangeTemplate}
        className="w-full py-2 px-4 border-2 border-dashed border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
      >
        Change Template
      </button>
    </div>
  );
};

// Template Selection Modal
const TemplateModal = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedColor, setSelectedColor] = useState("purple");
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const colors = [
    { name: "purple", class: "bg-purple-500" },
    { name: "blue", class: "bg-blue-500" },
    { name: "red", class: "bg-red-500" },
    { name: "green", class: "bg-green-500" },
    { name: "yellow", class: "bg-yellow-500" },
    { name: "pink", class: "bg-pink-500" },
    { name: "indigo", class: "bg-indigo-500" },
  ];

  const templates = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    name: i < 2 ? "Recommended" : "Template",
    preview: `Template ${i + 1}`,
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Change Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Preview */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Template Preview</div>
              </div>
            </div>

            {/* Right: Options */}
            <div className="lg:col-span-2">
              {/* Color Picker */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Choose color</h3>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        selectedColor === color.name
                          ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="relative">
                    <div
                      className={`bg-gray-700 rounded-lg h-32 flex items-center justify-center cursor-pointer border-2 transition-colors ${
                        selectedTemplate === template.id
                          ? "border-purple-500 bg-gray-600"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 left-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                          <span className="absolute -top-1 -left-1 text-xs text-purple-400">
                            Selected
                          </span>
                        </div>
                      )}
                      <div className="text-gray-300 text-sm">
                        {template.preview}
                      </div>
                    </div>
                    {template.name === "Recommended" && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                          {template.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={() => onSelectTemplate(selectedTemplate, selectedColor)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CompletionPage() {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load resume data
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const data = await getUserResume();
        setResumeData(data);
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleEnhanceWithAI = async () => {
    setEnhancing(true);
    try {
      const enhancedResume = await enhanceWithAI(resumeData);
      setResumeData(enhancedResume);
      // Show success message or redirect
      navigate("/resume/preview");
    } catch (err) {
      console.error("Error enhancing resume:", err);
    } finally {
      setEnhancing(false);
    }
  };

  const handleEdit = () => {
    navigate("/resume/personal-info");
  };

  const handlePreview = () => {
    navigate("/resume/preview");
  };

  const handleNext = () => {
    navigate("/resume/download");
  };

  const handleChangeTemplate = () => {
    setShowTemplateModal(true);
  };

  const handleSelectTemplate = (templateId, color) => {
    // Apply template and color changes
    console.log("Selected template:", templateId, "Color:", color);
    setShowTemplateModal(false);
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Completion Message */}
            <div className="flex flex-col justify-center">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Your resume has been completed
                </h1>
                <p className="text-gray-400 mb-8">
                  Would you like to enhance it with AI?
                </p>

                {/* Enhance with AI Button */}
                <button
                  onClick={handleEnhanceWithAI}
                  disabled={enhancing}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mb-6 flex items-center justify-center space-x-2"
                >
                  {enhancing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Enhance with AI</span>
                    </>
                  )}
                </button>

                {/* Edit Button */}
                <div className="mb-8">
                  <button
                    onClick={handleEdit}
                    className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Template Preview */}
            <div>
              <TemplatePreview onChangeTemplate={handleChangeTemplate} />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <div></div> {/* Empty div for spacing */}
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
                {loading ? "Processing..." : "Next"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Template Selection Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
