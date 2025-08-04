import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth Context
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Page components
import JobSearchLandingPage from './template';
import ResumeBuilderPage1 from './resumeBuilderPage1';
import EducationDetails from './EducationDetails';
import SkillsDetails from './SkillsDetails';
import ProfessionalExperience from './ProfessionalExperience';
import ProjectDetails from './ProjectDetails';
import JobSearchDashboard from './JobSearchDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Layout components
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App bg-black text-white min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <JobSearchLandingPage />
              </>              
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Resume builder flow - protected */}
            <Route 
              path="/resume" 
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <ResumeBuilderPage1 />
                  </>
                </PrivateRoute>
              }
            />
            
            <Route 
              path="/resume/education" 
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <EducationDetails />
                  </>
                </PrivateRoute>
              }
            />
            
            <Route 
              path="/resume/experience" 
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <ProfessionalExperience />
                  </>
                </PrivateRoute>
              }
            />
            
            <Route 
              path="/resume/projects" 
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <ProjectDetails />
                  </>
                </PrivateRoute>
              }
            />
            
            <Route 
              path="/resume/skills" 
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <SkillsDetails />
                  </>
                </PrivateRoute>
              }
            />
            
            {/* Dashboard - protected */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <JobSearchDashboard />
                  </>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
