import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from './context/AuthContext';

export default function JobSearchLandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-black text-white min-h-screen">            
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mb-4">
          Land your next <br />
          <span className="bg-gradient-to-r from-purple-500 to-purple-300 text-transparent bg-clip-text">line of work</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Kariera automates your job search—matching you with top jobs, crafting custom
          resumes, and writing tailored cover letters, so you can focus
          on landing your next role.
        </p>

        <div className="flex max-w-xl mx-auto mb-16">
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Enter Email address"
              className="w-full px-6 py-4 pr-36 rounded-full border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
            <Link 
              to={isAuthenticated ? "/dashboard" : "/login"} 
              className="absolute right-1 top-1 px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Get started
            </Link>
          </div>
        </div>

        <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-16">
          {['Automated applications', 'Personalized content generation', 'Accurate job matching'].map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Resume generation using AI",
              description: "Create a professional, tailored resume in seconds with our AI-powered resume builder, designed to meet the requirements of every job and location."
            },
            {
              title: "Advanced job matching",
              description: "Our smart algorithm finds the best job opportunities for you, ensuring you apply to positions that match your skills and experience."
            },
            {
              title: "Cover letter generation using AI",
              description: "Generate personalized, ATS-friendly cover letters that highlight your strengths and resonate with hiring managers, tailored to each job application."
            },
            {
              title: "Automated Application",
              description: "Streamline your job hunt by automatically sending customized applications to top employers, saving you time and effort."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
              <h3 className="text-2xl font-bold mb-4 text-left">{feature.title}</h3>
              <p className="text-gray-400 text-left">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}