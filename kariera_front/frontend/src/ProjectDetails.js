import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {string} projectTitle
 * @property {string} subTitle
 * @property {string} city
 * @property {string} country
 * @property {string} startMonth
 * @property {string} startYear
 * @property {string} endMonth
 * @property {string} endYear
 * @property {boolean} isPresent
 * @property {string} description
 */

export default function ProjectDetails() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectTitle: '',
      subTitle: '',
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

  const addProject = () => {
    const newId = projects.length + 1;
    setProjects([
      ...projects,
      {
        id: newId,
        projectTitle: '',
        subTitle: '',
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
    setProjects(
      projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted', projects);
    navigate('/resume/skills');
  };

  useEffect(() => {
    projects.forEach(proj => {
      if (proj.isPresent) {
        handleInputChange(proj.id, 'endMonth', '');
        handleInputChange(proj.id, 'endYear', '');
      }
    });
  }, [projects]);

  return (
    <div className="bg-black min-h-screen text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2 text-center">Some personal details.</h1>
        <h2 className="text-2xl font-bold mb-8 text-center">Project</h2>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {projects.map((project) => (
            <div key={project.id} className="mb-8">
              <div className="mb-4">
                <label htmlFor={`projectTitle-${project.id}`} className="block text-sm font-medium text-gray-400 mb-1">Project Title*</label>
                <input 
                  id={`projectTitle-${project.id}`}
                  type="text"
                  value={project.projectTitle}
                  onChange={(e) => handleInputChange(project.id, 'projectTitle', e.target.value)}
                  placeholder="Enter your position in the project"
                  required 
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="mb-4">
                <label htmlFor={`subTitle-${project.id}`} className="block text-sm font-medium text-gray-400 mb-1">Sub Title*</label>
                <input 
                  id={`subTitle-${project.id}`}
                  type="text"
                  value={project.subTitle}
                  onChange={(e) => handleInputChange(project.id, 'subTitle', e.target.value)}
                  placeholder="Enter sub title"
                  required 
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`city-${project.id}`} className="block text-sm font-medium text-gray-400 mb-1">City*</label>
                  <input 
                    id={`city-${project.id}`}
                    type="text"
                    value={project.city}
                    onChange={(e) => handleInputChange(project.id, 'city', e.target.value)}
                    placeholder="City"
                    required 
                    className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label htmlFor={`country-${project.id}`} className="block text-sm font-medium text-gray-400 mb-1">Country*</label>
                  <input 
                    id={`country-${project.id}`}
                    type="text"
                    value={project.country}
                    onChange={(e) => handleInputChange(project.id, 'country', e.target.value)}
                    placeholder="Country"
                    required 
                    className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`startDate-${project.id}`} className="block text-sm font-medium text-gray-400 mb-1">Start Date*</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      id={`startMonth-${project.id}`}
                      type="text"
                      value={project.startMonth}
                      onChange={(e) => handleInputChange(project.id, 'startMonth', e.target.value)}
                      placeholder="Month"
                      required 
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <input 
                      id={`startYear-${project.id}`}
                      type="text"
                      value={project.startYear}
                      onChange={(e) => handleInputChange(project.id, 'startYear', e.target.value)}
                      placeholder="Year"
                      required 
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor={`endDate-${project.id}`} className="block text-sm font-medium text-gray-400 mb-1">End Date*</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      id={`endMonth-${project.id}`}
                      type="text"
                      value={project.endMonth}
                      onChange={(e) => handleInputChange(project.id, 'endMonth', e.target.value)}
                      placeholder="Month"
                      required 
                      disabled={project.isPresent}
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input 
                      id={`endYear-${project.id}`}
                      type="text"
                      value={project.endYear}
                      onChange={(e) => handleInputChange(project.id, 'endYear', e.target.value)}
                      placeholder="Year"
                      required 
                      disabled={project.isPresent}
                      className="w-full px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={project.isPresent}
                        onChange={(e) => handleInputChange(project.id, 'isPresent', e.target.checked)}
                        className="sr-only peer"
                        id={`present-${project.id}`}
                      />
                      <div className="w-6 h-6 border-2 border-purple-600 rounded-full peer-checked:border-purple-600 peer-checked:bg-purple-600 transition-all duration-200 ease-in-out"></div>
                      <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out opacity-0 peer-checked:opacity-100">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    </div>
                    <label htmlFor={`present-${project.id}`} className="ml-2 text-sm text-gray-400">Present</label>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor={`description-${project.id}`} className="block text-sm font-medium text-gray-400 mb-1">Description*</label>
                <textarea 
                  id={`description-${project.id}`}
                  value={project.description}
                  onChange={(e) => handleInputChange(project.id, 'description', e.target.value)}
                  placeholder="Describe what you did in the project"
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
              onClick={addProject}
              className="w-10 h-10 rounded-full bg-purple-600 text-white flex justify-center text-2xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
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