import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EducationDetails() {
  const navigate = useNavigate();
  const [educations, setEducations] = useState([{ id: 1 }]);

  const addEducation = () => {
    const newId = educations.length + 1;
    setEducations([...educations, { id: newId }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    navigate('/resume/experience');
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2 text-center">Some personal details.</h1>
        <h2 className="text-2xl font-bold mb-8 text-center">Education</h2>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {educations.map((education) => (
            <div key={education.id} className="mb-8 p-6">
              <div className="mb-4">
                <label htmlFor={`degree-${education.id}`} className="block text-sm font-medium text-gray-400 mb-1">Degree*</label>
                <input 
                  id={`degree-${education.id}`}
                  type="text"
                  placeholder="Enter degree or field of study"
                  required 
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="mb-4">
                <label htmlFor={`school-${education.id}`} className="block text-sm font-medium text-gray-400 mb-1">School*</label>
                <input 
                  id={`school-${education.id}`}
                  type="text"
                  placeholder="Enter school name"
                  required 
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`city-${education.id}`} className="block text-sm font-medium text-gray-400 mb-1">City*</label>
                  <input 
                    id={`city-${education.id}`}
                    type="text"
                    placeholder="City"
                    required 
                    className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label htmlFor={`country-${education.id}`} className="block text-sm font-medium text-gray-400 mb-1">Country*</label>
                  <input 
                    id={`country-${education.id}`}
                    type="text"
                    placeholder="Country"
                    required 
                    className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`start-date-${education.id}`} className="block text-sm font-medium text-gray-400 mb-1">Start Date*</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      id={`start-month-${education.id}`}
                      type="text"
                      placeholder="Month"
                      required 
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <input 
                      id={`start-year-${education.id}`}
                      type="text"
                      placeholder="Year"
                      required 
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor={`end-date-${education.id}`} className="block text-sm font-medium text-gray-400 mb-1">End Date*</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      id={`end-month-${education.id}`}
                      type="text"
                      placeholder="Month"
                      required 
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <input 
                      id={`end-year-${education.id}`}
                      type="text"
                      placeholder="Year"
                      required 
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor={`description-${education.id}`} className="block text-sm font-medium text-gray-400 mb-1">Description*</label>
                <textarea 
                  id={`description-${education.id}`}
                  placeholder="Write a brief description about your experience in this school"
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
              onClick={addEducation}
              className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-2xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
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