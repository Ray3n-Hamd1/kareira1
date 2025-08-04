import React, { useState } from 'react';
import { generateCoverLetter } from '../services/coverLetterService';

export default function CoverLetterGenerator({ job }) {
  const [coverLetter, setCoverLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    jobTitle: job?.title || job?.jobTitle || '',
    company: job?.company || '',
    location: job?.location || '',
    description: job?.description || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await generateCoverLetter(formData);
      if (result && result.cover_letter) {
        setCoverLetter(JSON.parse(result.cover_letter));
      } else {
        setError('Failed to generate cover letter');
      }
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError('An error occurred while generating the cover letter');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Generate Cover Letter</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}
      
      {!coverLetter ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="mb-4">
              <p className="text-sm text-gray-400">To: {coverLetter.to}</p>
              <p className="text-sm text-gray-400">From: {coverLetter.from}</p>
              <p className="text-sm text-gray-400">Subject: {coverLetter.subject}</p>
            </div>
            
            <div className="whitespace-pre-line">
              {coverLetter.body}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setCoverLetter(null)}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Edit
            </button>
            
            <button
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([`To: ${coverLetter.to}\nFrom: ${coverLetter.from}\nSubject: ${coverLetter.subject}\n\n${coverLetter.body}`], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = 'cover-letter.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
