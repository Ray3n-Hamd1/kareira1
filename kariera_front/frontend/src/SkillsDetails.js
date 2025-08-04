import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SkillsDetails() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const addSkill = () => {
    if (currentSkill.trim() !== '') {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Skills submitted:', skills);
    // Navigate to dashboard after completing the resume
    navigate('/dashboard');
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2 text-center">Some personal details.</h1>
        <h2 className="text-2xl font-bold mb-8 text-center">Skills</h2>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-6">
            <label htmlFor="skill" className="block text-sm font-medium text-gray-400 mb-1">Skill</label>
            <div className="flex items-center">
              <input 
                id="skill"
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Enter your skill"
                className="flex-grow px-3 py-2 bg-gray-900 border border-purple-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button 
                type="button" 
                onClick={addSkill}
                className="ml-2 w-8 h-8 rounded-full bg-purple-600 text-white flex justify-center text-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 self-center"
              >
                +
              </button>
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Added Skills:</h3>
              <ul className="list-disc list-inside">
                {skills.map((skill, index) => (
                  <li key={index} className="text-gray-300">{skill}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              Save and finish
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
