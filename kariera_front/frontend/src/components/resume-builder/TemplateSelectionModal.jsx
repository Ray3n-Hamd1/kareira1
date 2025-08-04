import React, { useState } from "react";

// Template Selection Modal Component
export default function TemplateSelectionModal({
  isOpen,
  onClose,
  onSelectTemplate,
  currentTemplate = 0,
  currentColor = "purple",
}) {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);

  const colors = [
    { name: "purple", class: "bg-purple-500", hex: "#8b5cf6" },
    { name: "blue", class: "bg-blue-500", hex: "#3b82f6" },
    { name: "red", class: "bg-red-500", hex: "#ef4444" },
    { name: "green", class: "bg-green-500", hex: "#10b981" },
    { name: "yellow", class: "bg-yellow-500", hex: "#f59e0b" },
    { name: "pink", class: "bg-pink-500", hex: "#ec4899" },
    { name: "indigo", class: "bg-indigo-500", hex: "#6366f1" },
  ];

  const templates = [
    { id: 0, name: "Recommended", isRecommended: true },
    { id: 1, name: "Recommended", isRecommended: true },
    { id: 2, name: "Classic", isRecommended: false },
    { id: 3, name: "Modern", isRecommended: false },
    { id: 4, name: "Creative", isRecommended: false },
    { id: 5, name: "Professional", isRecommended: false },
  ];

  const handleApply = () => {
    onSelectTemplate(selectedTemplate, selectedColor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Change Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Preview */}
            <div>
              <div className="bg-gray-800 rounded-lg p-6 h-80 flex items-center justify-center mb-4">
                <div className="bg-white rounded-lg w-full h-full p-4 overflow-hidden">
                  {/* Mock Resume Preview */}
                  <div className="text-black text-xs">
                    <div
                      className="mb-3 pb-2"
                      style={{
                        borderBottomColor: colors.find(
                          (c) => c.name === selectedColor
                        )?.hex,
                      }}
                    >
                      <h2
                        className="text-lg font-bold"
                        style={{
                          color: colors.find((c) => c.name === selectedColor)
                            ?.hex,
                        }}
                      >
                        John Doe
                      </h2>
                      <p className="text-sm text-gray-600">UI/UX Designer</p>
                      <p className="text-xs text-gray-500">
                        john.doe@email.com | +1 234 567 8900
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3
                          className="text-sm font-semibold pb-1 border-b border-gray-300"
                          style={{
                            color: colors.find((c) => c.name === selectedColor)
                              ?.hex,
                          }}
                        >
                          EXPERIENCE
                        </h3>
                        <div className="mt-2">
                          <p className="text-xs font-medium">UI/UX Designer</p>
                          <p className="text-xs text-gray-600">
                            Grey Finance • Lagos, Nigeria
                          </p>
                          <p className="text-xs text-gray-500">
                            Sep 2023 - Aug 2024
                          </p>
                          <ul className="text-xs text-gray-700 mt-1 space-y-1">
                            <li>
                              • Designed user interfaces for web applications
                            </li>
                            <li>• Collaborated with development teams</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3
                          className="text-sm font-semibold pb-1 border-b border-gray-300"
                          style={{
                            color: colors.find((c) => c.name === selectedColor)
                              ?.hex,
                          }}
                        >
                          EDUCATION
                        </h3>
                        <div className="mt-2">
                          <p className="text-xs font-medium">
                            Bachelor of Science - Architecture
                          </p>
                          <p className="text-xs text-gray-600">
                            University of Ibadan
                          </p>
                          <p className="text-xs text-gray-500">
                            Graduated Nov 2023
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3
                          className="text-sm font-semibold pb-1 border-b border-gray-300"
                          style={{
                            color: colors.find((c) => c.name === selectedColor)
                              ?.hex,
                          }}
                        >
                          SKILLS
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {[
                            "Prototyping",
                            "Wireframing",
                            "Figma",
                            "Sketch",
                          ].map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-1 rounded text-white"
                              style={{
                                backgroundColor: colors.find(
                                  (c) => c.name === selectedColor
                                )?.hex,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Template and Color Options */}
            <div>
              {/* Color Picker */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Choose color</h3>
                <div className="flex space-x-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full ${
                        color.class
                      } transition-all ${
                        selectedColor === color.name
                          ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110"
                          : "hover:scale-105"
                      }`}
                      title={
                        color.name.charAt(0).toUpperCase() + color.name.slice(1)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Template Grid */}
              <div>
                <h3 className="text-white font-medium mb-3">Select template</h3>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div key={template.id} className="relative">
                      <button
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`w-full bg-gray-700 rounded-lg h-32 flex items-center justify-center cursor-pointer border-2 transition-all relative overflow-hidden ${
                          selectedTemplate === template.id
                            ? "border-purple-500 bg-gray-600 scale-105"
                            : "border-gray-600 hover:border-gray-500 hover:bg-gray-650"
                        }`}
                      >
                        {/* Mock template preview */}
                        <div className="text-gray-300 text-xs text-center">
                          <div className="w-16 h-20 bg-white rounded-sm mx-auto mb-1 flex flex-col p-1">
                            <div
                              className="h-2 rounded-sm mb-1"
                              style={{
                                backgroundColor: colors.find(
                                  (c) => c.name === selectedColor
                                )?.hex,
                              }}
                            ></div>
                            <div className="space-y-0.5">
                              <div className="h-0.5 bg-gray-300 rounded"></div>
                              <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                              <div className="h-0.5 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                          <p className="text-xs">Template {template.id + 1}</p>
                        </div>

                        {/* Selected indicator */}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 left-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>

                      {/* Recommended badge */}
                      {template.isRecommended && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-700 space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
