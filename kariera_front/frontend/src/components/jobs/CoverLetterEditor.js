// src/components/jobs/CoverLetterEditor.js
import React, { useState } from "react";
import {
  X,
  Save,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react";
import coverLetterService from "../../services/coverLetterService";

export default function CoverLetterEditor({
  initialContent = "",
  job,
  userData,
  onSave,
  onCancel,
}) {
  const [content, setContent] = useState(initialContent);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedTone, setSelectedTone] = useState("default");
  const [selectedEmphasis, setSelectedEmphasis] = useState("default");
  const [enhancementError, setEnhancementError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const tones = [
    { id: "default", name: "Default" },
    { id: "professional", name: "Professional" },
    { id: "enthusiastic", name: "Enthusiastic" },
    { id: "confident", name: "Confident" },
    { id: "conversational", name: "Conversational" },
  ];

  const emphases = [
    { id: "default", name: "Default" },
    { id: "skills", name: "Technical Skills" },
    { id: "achievements", name: "Achievements" },
    { id: "cultural-fit", name: "Cultural Fit" },
    { id: "passion", name: "Passion for Industry" },
  ];

  const handleEnhance = async () => {
    try {
      setIsEnhancing(true);
      setEnhancementError("");
      setSuccessMessage("");

      const instructions = {
        tone: selectedTone !== "default" ? selectedTone : null,
        emphasize: selectedEmphasis !== "default" ? selectedEmphasis : null,
      };

      const enhancedLetter = await coverLetterService.enhanceCoverLetter(
        content,
        job,
        instructions
      );

      setContent(enhancedLetter);
      setSuccessMessage("Cover letter enhanced successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setEnhancementError(error.message || "Failed to enhance cover letter");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSave = () => {
    onSave(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${job.title} - Cover Letter.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-gray-900 rounded-xl w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Edit Cover Letter
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Write your cover letter here..."
        ></textarea>
      </div>

      {/* Enhancement Options */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-white mb-1">
              AI Enhancement Options
            </h3>
            <p className="text-sm text-gray-400">
              Customize your cover letter with AI assistance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tone
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            >
              {tones.map((tone) => (
                <option key={tone.id} value={tone.id}>
                  {tone.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Emphasis
            </label>
            <select
              value={selectedEmphasis}
              onChange={(e) => setSelectedEmphasis(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            >
              {emphases.map((emphasis) => (
                <option key={emphasis.id} value={emphasis.id}>
                  {emphasis.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnhancing ? (
            <>
              <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Enhance with AI
            </>
          )}
        </button>

        {enhancementError && (
          <div className="mt-3 bg-red-900/20 border border-red-500 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{enhancementError}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-3 bg-green-900/20 border border-green-500 rounded-lg p-3 flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-300">{successMessage}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="space-x-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          <button
            onClick={() => setContent(initialContent)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="space-x-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
