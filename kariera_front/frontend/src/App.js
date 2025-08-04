import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Auth Context
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Page components
import JobSearchLandingPage from "./template";
import ResumeBuilderPage1 from "./resumeBuilderPage1";
import EducationDetails from "./EducationDetails";
import SkillsDetails from "./SkillsDetails";
import ProfessionalExperience from "./ProfessionalExperience";
import ProjectDetails from "./ProjectDetails";
import JobSearchDashboard from "./JobSearchDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkHistoryPage from "./components/resume-builder/WorkHistoryPage";
import JobDescriptionPage from "./components/resume-builder/JobDescriptionPage";
import WorkHistorySummaryPage from "./components/resume-builder/WorkHistorySummaryPage";
import EducationPage from "./components/resume-builder/EducationPage";
import EducationAdditionalPage from "./components/resume-builder/EducationAdditionalPage";
import EducationSummaryPage from "./components/resume-builder/EducationSummaryPage";
import SkillsPage from "./components/resume-builder/SkillsPage";
import CertificationsPage from "./components/resume-builder/CertificationsPage";
import ProjectsPage from "./components/resume-builder/ProjectsPage";
import ProjectsSummaryPage from "./components/resume-builder/ProjectsSummaryPage";
import LinksPage from "./components/resume-builder/LinksPage";
import BackgroundSummaryPage from "./components/resume-builder/BackgroundSummaryPage";
import SoftwareSkillsPage from "./components/resume-builder/SoftwareSkillsPage";
import InterestsHobbiesPage from "./components/resume-builder/InterestsHobbiesPage";
import CompletionPage from "./components/resume-builder/CompletionPage";

// Layout components
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App bg-black text-white min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <JobSearchLandingPage />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            // Replace your resume routes section with:
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
              path="/resume/work-history"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <WorkHistoryPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/job-description"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <JobDescriptionPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/work-history-summary"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <WorkHistorySummaryPage />
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
                    <EducationPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/education-additional"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <EducationAdditionalPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/education-summary"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <EducationSummaryPage />
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
                    <SkillsPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/certifications"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <CertificationsPage />
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
                    <ProjectsPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/projects-summary"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <ProjectsSummaryPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/links"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <LinksPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/background-summary"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <BackgroundSummaryPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/software-skills"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <SoftwareSkillsPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/interests-hobbies"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <InterestsHobbiesPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/resume/completion"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <CompletionPage />
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
