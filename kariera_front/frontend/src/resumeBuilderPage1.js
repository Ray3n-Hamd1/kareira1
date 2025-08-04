import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePersonalInfo, getUserResume } from './services/resumeService';

// Progress Steps Component
const ProgressSteps = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, name: 'Personal Info' },
    { id: 2, name: 'Work History' },
    { id: 3, name: 'Education' },
    { id: 4, name: 'Skills' },
    { id: 5, name: 'Certifications' },
    { id: 6, name: 'Projects' },
    { id: 7, name: 'Finalize' },
  ];

  // Calculate progress percentage based on current step
  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="mb-8">
      {/* Steps Row - All in One Big Oval Container */}
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="flex items-center justify-between flex-1 mr-6 bg-gray-800 rounded-full px-2 py-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                step.id === currentStep
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400'
              }`}
            >
              {step.id} {step.name}
            </div>
          ))}
        </div>
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {progressPercentage}%
        </div>
      </div>
      
      {/* Simple Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-1">
        <div 
          className="bg-purple-600 h-1 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Template Preview Component
const TemplatePreview = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Current Template</h3>
      <p className="text-gray-400 text-sm mb-6">
        You can view different templates and select the one you love best
      </p>
      
      {/* Template Preview Area */}
      <div className="bg-gray-900 rounded-lg h-96 mb-6 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Template Preview</div>
      </div>
      
      <button className="w-full py-2 px-4 border-2 border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
        Change Template
      </button>
    </div>
  );
};

export default function ResumeBuilderPage1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    languages: '',
    district: '',
    cityCountry: '',
    postalCode: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load existing data if available
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await getUserResume();
        if (resumeData && resumeData.personalInfo) {
          // Map existing data to new structure
          const personalInfo = resumeData.personalInfo;
          setFormData({
            firstName: personalInfo.firstName || personalInfo.fullName?.split(' ')[0] || '',
            lastName: personalInfo.lastName || personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
            jobTitle: personalInfo.jobTitle || '',
            languages: personalInfo.languages || '',
            district: personalInfo.district || '',
            cityCountry: personalInfo.cityCountry || personalInfo.address || '',
            postalCode: personalInfo.postalCode || '',
            phone: personalInfo.phone || '',
            email: personalInfo.email || '',
          });
        }
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading resume data:', err);
        setIsLoaded(true);
      }
    };

    loadResumeData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Transform data for backward compatibility
      const dataToSave = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        address: formData.cityCountry, // for backward compatibility
      };
      await savePersonalInfo(dataToSave);
      navigate('/resume/work-history');
    } catch (err) {
      console.error('Error saving personal info:', err);
      setError('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePreview = () => {
    // Navigate to preview page or open preview modal
    navigate('/resume/preview');
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

      <main className="container mx-auto px-6 py-8">
        <ProgressSteps currentStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              What's the best way for employers to contact you?
            </h1>
            <p className="text-gray-400 mb-8">
              Including an email and phone number is advisable
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                    First Name
                  </label>
                  <input 
                    id="firstName" 
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name" 
                    required 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input 
                    id="lastName" 
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter first name" 
                    required 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Professional (job title)
                </label>
                <input 
                  id="jobTitle" 
                  type="text"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g UI/UX Designer" 
                  required 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              {/* Languages */}
              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-300 mb-1">
                  Languages
                </label>
                <input 
                  id="languages" 
                  type="text"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="e.g yoruba, English" 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-300 mb-1">
                    District
                  </label>
                  <input 
                    id="district" 
                    type="text"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter district name" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="cityCountry" className="block text-sm font-medium text-gray-300 mb-1">
                    City-country
                  </label>
                  <input 
                    id="cityCountry" 
                    type="text"
                    value={formData.cityCountry}
                    onChange={handleChange}
                    placeholder="e.g lagos, Nigeria" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">
                    Postal code
                  </label>
                  <input 
                    id="postalCode" 
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone
                  </label>
                  <input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address" 
                    required 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Template Preview */}
          <div>
            <TemplatePreview />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12">
          <button 
            type="button"
            onClick={handleGoBack}
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go back
          </button>
          
          <div className="flex space-x-4">
            <button 
              type="button"
              onClick={handlePreview}
              className="px-6 py-3 border border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
            >
              Preview
            </button>
            <button 
              type="submit"
              form="resume-form"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}