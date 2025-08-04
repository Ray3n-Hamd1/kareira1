import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import JobSearchLandingPage from './template'
import ResumeBuilderPage1 from './resumeBuilderPage1'
import EducationDetails from './EducationDetails'
import SkillsDetails from './SkillsDetails'
import ProfessionalExperience from './ProfessionalExperience'
import ProjectDetails from './ProjectDetails'
import JobSearchDashboard from './JobSearchDashboard'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <JobSearchDashboard />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
