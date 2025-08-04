import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookmarkIcon, Clock, BriefcaseIcon, MapPinIcon, DollarSignIcon, FilterIcon, ArrowUpRight } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { searchJobs, saveJob, getSavedJobs } from './services/jobService';

export default function JobSearchDashboard() {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  const [error, setError] = useState(null);

  // Protect this page from unauthenticated users
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  // Fetch jobs on component mount
  useEffect(() => {
    // Define mock jobs inside the effect to avoid dependency issues
    const mockJobs = [
      {
        id: 1,
        title: 'Frontend Developer Intern',
        company: 'TechCorp',
        location: 'Paris, France',
        type: 'Internship',
        salary: '€1,200/month',
        posted: '2 days ago',
        description: 'Exciting opportunity to work with a growing tech company on React and modern frontend technologies.',
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind'],
        isRemote: true
      },
      {
        id: 2,
        title: 'Backend Developer Intern',
        company: 'ServerSide Inc',
        location: 'Lyon, France',
        type: 'Internship',
        salary: '€1,300/month',
        posted: '1 day ago',
        description: 'Join our backend team to develop scalable APIs and services using Node.js and Express.',
        skills: ['Node.js', 'Express', 'MongoDB', 'RESTful APIs'],
        isRemote: false
      },
      {
        id: 3,
        title: 'Data Science Intern',
        company: 'DataMinds',
        location: 'Remote',
        type: 'Internship',
        salary: '€1,400/month',
        posted: '3 days ago',
        description: 'Work on exciting data analysis projects and machine learning models.',
        skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
        isRemote: true
      },
      {
        id: 4,
        title: 'UX/UI Design Intern',
        company: 'CreativeStudio',
        location: 'Marseille, France',
        type: 'Internship',
        salary: '€1,100/month',
        posted: '1 week ago',
        description: 'Help design beautiful and functional user interfaces for our products.',
        skills: ['Figma', 'UI Design', 'Prototyping', 'User Research'],
        isRemote: false
      },
      {
        id: 5,
        title: 'Full Stack Developer Intern',
        company: 'WebWizards',
        location: 'Bordeaux, France',
        type: 'Internship',
        salary: '€1,500/month',
        posted: '5 days ago',
        description: 'Work on both frontend and backend development in a fast-paced environment.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
        isRemote: true
      },
    ];
    
    setIsLoading(true);
    
    // In a real implementation, fetch jobs from your API
    // const fetchJobs = async () => {
    //   try {
    //     const response = await searchJobs({ query: searchTerm });
    //     setJobs(response.jobs || []);
    //   } catch (err) {
    //     console.error('Error fetching jobs:', err);
    //     setError('Failed to load jobs. Please try again later.');
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchJobs();
    
    // For now, use mock data with timeout to simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
      setSavedJobIds(new Set([1, 3])); // Preset some saved jobs
      setIsLoading(false);
    }, 1000);
    
  }, []); // No external dependencies now that mockJobs is inside the effect
  
  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Toggle saved job status
  const handleSaveJob = (jobId) => {
    setSavedJobIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
    
    // In a real implementation, call the API to save the job
    // try {
    //   await saveJob(jobId);
    // } catch (err) {
    //   setError('Failed to save job. Please try again.');
    // }
  };
  
  // If still loading or not authenticated, show loading state
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }
  
  // Render appropriate jobs based on active tab
  const displayJobs = activeTab === 'recommended' 
    ? filteredJobs 
    : filteredJobs.filter(job => savedJobIds.has(job.id));
  
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-gray-400">Ready to find your next opportunity?</p>
        </div>
        
        {/* Search and filter */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs, companies, or locations"
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700">
              <FilterIcon className="w-4 h-4" />
              Filters
            </button>
            <button className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700">Full-time</button>
            <button className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700">Internship</button>
            <button className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700">Remote</button>
            <button className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700">Tech</button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Tabs for recommended/saved jobs */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`pb-4 px-4 font-medium ${activeTab === 'recommended' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended Jobs
          </button>
          <button
            className={`pb-4 px-4 font-medium ${activeTab === 'saved' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Jobs ({savedJobIds.size})
          </button>
        </div>
        
        {/* Job listings */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : displayJobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl">
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-gray-400">
                {activeTab === 'recommended' 
                  ? 'Try adjusting your search terms or filters' 
                  : 'You haven\'t saved any jobs yet'}
              </p>
            </div>
          ) : (
            displayJobs.map(job => (
              <div key={job.id} className="bg-gray-900 rounded-xl p-6 transition-shadow hover:shadow-lg">
                <div className="flex justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-900 w-12 h-12 rounded-md flex items-center justify-center text-lg font-bold">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-gray-400">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-800 px-2 py-1 rounded-full">
                          <MapPinIcon className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-800 px-2 py-1 rounded-full">
                          <BriefcaseIcon className="w-3 h-3" />
                          {job.type}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-800 px-2 py-1 rounded-full">
                          <DollarSignIcon className="w-3 h-3" />
                          {job.salary}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-800 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {job.posted}
                        </span>
                        {job.isRemote && (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-900 px-2 py-1 rounded-full">
                            Remote
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-yellow-500"
                    onClick={() => handleSaveJob(job.id)}
                  >
                    <BookmarkIcon 
                      className={`h-6 w-6 ${savedJobIds.has(job.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} 
                    />
                  </button>
                </div>
                
                <p className="mt-4 text-gray-300">{job.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="text-xs bg-gray-800 px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Applied by 24 people</span>
                  <button className="flex items-center gap-1 px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors">
                    Apply Now
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}