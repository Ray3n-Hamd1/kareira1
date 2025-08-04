import React, { useState } from 'react';
import { getJobRecommendations } from '../services/jobService';

const ResumeUploader = ({ onJobsReceived }) => {
  const [file, setFile] = useState(null);
  const [country, setCountry] = useState('USA');
  const [jobTitle, setJobTitle] = useState('Internship');
  const [numberOfJobs, setNumberOfJobs] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a resume file');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('country', country);
      formData.append('jobTitle', jobTitle);
      formData.append('numberOfJobs', numberOfJobs);
      
      const result = await getJobRecommendations(formData);
      
      if (result && result.jobs) {
        onJobsReceived(result.jobs);
      } else {
        setError('No job recommendations found');
      }
    } catch (err) {
      console.error('Error getting job recommendations:', err);
      setError('Failed to process resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Upload Resume for Job Matches</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          >
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Number of Jobs
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={numberOfJobs}
            onChange={(e) => setNumberOfJobs(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !file}
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Get Job Recommendations'}
        </button>
      </form>
    </div>
  );
};

export default ResumeUploader;
