import axios from 'axios';
import React, { useState, useEffect } from 'react';

/**
 * @typedef {Object} Experience
 * @property {number} id
 * @property {string} jobTitle
 * @property {string} employer
 * @property {string} city
 * @property {string} country
 * @property {string} startMonth
 * @property {string} startYear
 * @property {string} endMonth
 * @property {string} endYear
 * @property {boolean} isPresent
 * @property {string} description
 */

export default function ProfessionalExperience() {
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      jobTitle: '',
      employer: '',
      city: '',
      country: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      isPresent: false,
      description: '',
    },
  ]);

  const addExperience = () => {
    const newId = experiences.length + 1;
    setExperiences([
      ...experiences,
      {
        id: newId,
        jobTitle: '',
        employer: '',
        city: '',
        country: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        isPresent: false,
        description: '',
      },
    ]);
  };

  const handleInputChange = (id, field, value) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/jobs', title, company, location, startDate, endDate, workHere, description, user_id)
      .then((response) => {
        console.log('Data saved successfully:', response.data);
        // Handle success (e.g., redirect to another page)
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        // Handle error (e.g., show an error message)
      });
  };

  useEffect(() => {
    experiences.forEach(exp => {
      if (exp.isPresent) {
        handleInputChange(exp.id, 'endMonth', '');
        handleInputChange(exp.id, 'endYear', '');
      }
    });
  }, [experiences]);

  return (
    <div className="bg-black min-h-screen text-white">      

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2 text-center">Some personal details.</h1>
        <h2 className="text-2xl font-bold mb-8 text-center">Professional experience</h2>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {experiences.map((experience) => (
            <div key={experience.id} className="mb-8">
              <div className="mb-4">
                <label htmlFor={`jobTitle-${experience.id}`} className="block text-sm font-medium text-gray-400 mb-1">Job Title*</label>
                <input 
                  id={`jobTitle-${experience.id}`}
                  type="text"
                  value={experience.jobTitle}
                  onChange={(e) => handleInputChange(experience.id, 'jobTitle', e.target.value)}
                  placeholder="Enter your job title"
                  required 
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="mb-4">
                <label htmlFor={`employer-${experience.id}`} className="block text-sm font-medium text-gray-400 mb-1">Employer*</label>
                <input 
                  id={`employer-${experience.id}`}
                  type="text"
                  value={experience.employer}
                  onChange={(e) => handleInputChange(experience.id, 'employer', e.target.value)}
                  placeholder="Enter your employer name"
                  required 
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`city-${experience.id}`} className="block text-sm font-medium text-gray-400 mb-1">City*</label>
                  <input 
                    id={`city-${experience.id}`}
                    type="text"
                    value={experience.city}
                    onChange={(e) => handleInputChange(experience.id, 'city', e.target.value)}
                    placeholder="City"
                    required 
                    className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label htmlFor={`country-${experience.id}`} className="block text-sm font-medium text-gray-400 mb-1">Country*</label>
                  <input 
                    id={`country-${experience.id}`}
                    type="text"
                    value={experience.country}
                    onChange={(e) => handleInputChange(experience.id, 'country', e.target.value)}
                    placeholder="Country"
                    required 
                    className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`startDate-${experience.id}`} className="block text-sm font-medium text-gray-400 mb-1">Start Date*</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      id={`startMonth-${experience.id}`}
                      type="text"
                      value={experience.startMonth}
                      onChange={(e) => handleInputChange(experience.id, 'startMonth', e.target.value)}
                      placeholder="Month"
                      required 
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <input 
                      id={`startYear-${experience.id}`}
                      type="text"
                      value={experience.startYear}
                      onChange={(e) => handleInputChange(experience.id, 'startYear', e.target.value)}
                      placeholder="Year"
                      required 
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor={`endDate-${experience.id}`} className="block text-sm font-medium text-gray-400 mb-1">End Date*</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      id={`endMonth-${experience.id}`}
                      type="text"
                      value={experience.endMonth}
                      onChange={(e) => handleInputChange(experience.id, 'endMonth', e.target.value)}
                      placeholder="Month"
                      required 
                      disabled={experience.isPresent}
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input 
                      id={`endYear-${experience.id}`}
                      type="text"
                      value={experience.endYear}
                      onChange={(e) => handleInputChange(experience.id, 'endYear', e.target.value)}
                      placeholder="Year"
                      required 
                      disabled={experience.isPresent}
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={experience.isPresent}
                        onChange={(e) => handleInputChange(experience.id, 'isPresent', e.target.checked)}
                        className="sr-only peer"
                        id={`present-${experience.id}`}
                      />
                      <div className="w-6 h-6 border-2 border-purple-600 rounded-full peer-checked:border-purple-600 peer-checked:bg-purple-600 transition-all duration-200 ease-in-out"></div>
                      <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out opacity-0 peer-checked:opacity-100">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    </div>
                    <label htmlFor={`present-${experience.id}`} className="ml-2 text-sm text-gray-400">Present</label>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor={`description-${experience.id}`} className="block text-sm font-medium text-gray-400 mb-1">Description*</label>
                <textarea 
                  id={`description-${experience.id}`}
                  value={experience.description}
                  onChange={(e) => handleInputChange(experience.id, 'description', e.target.value)}
                  placeholder="Describe your professional experience"
                  required 
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                ></textarea>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mb-6">
            <button 
              type="button" 
              onClick={addExperience}
              className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              +
            </button>
          </div>
          
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              Save and next
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
