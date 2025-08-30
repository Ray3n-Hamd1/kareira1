const { default: PDFDocument } = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { getUserInfo } = require('../services/userService');
const { refineResumeWithAI, matchCVWithAI } = require('../services/resumeService');

// Get user resume data
const getUserResume = async (req, res) => {
  try {
    const userInfo = await getUserInfo(req.userId);
    res.json(userInfo);
  } catch (error) {
    console.error('Error getting user resume:', error);
    res.status(500).json({ message: 'Error retrieving resume data' });
  }
};

// Refine resume for a specific country
const refineResume = async (req, res) => {
  try {
    const { targetCountry = 'USA' } = req.body;
    const userInfo = await getUserInfo(req.userId);
    
    const refinedResume = await refineResumeWithAI(userInfo, targetCountry);
    
    res.json({ success: true, refinedResume });
  } catch (error) {
    console.error('Error refining resume:', error);
    res.status(500).json({ message: 'Error refining resume', error: error.message });
  }
};

// Generate PDF resume
const generatePDFResume = async (req, res) => {
  try {
    const { refinedResume } = req.body;
    
    if (!refinedResume || typeof refinedResume !== 'object') {
      return res.status(400).json({ message: 'Invalid resume data format' });
    }
    
    const outputPath = path.join(__dirname, '../uploads', 'formatted_resume.pdf');
    
    // Create PDF document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    
    // Create a promise to track when PDF is finished
    const pdfPromise = new Promise((resolve, reject) => {
      doc.pipe(stream);
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    
    // Add content to PDF
    doc.fontSize(16).font('Helvetica-Bold').text(`${refinedResume.name}, ${refinedResume.title || ''}`, { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(`${refinedResume.email} | ${refinedResume.phone} | ${refinedResume.location}`, { align: 'center' });
    doc.moveDown(2);
    
    // Add professional experience
    if (refinedResume.professional_experience && refinedResume.professional_experience.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000080').text('Professional Experience');
      doc.moveDown(0.5);
      
      refinedResume.professional_experience.forEach(exp => {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
          .text(`${exp.job_title} at ${exp.company} (${exp.dates})`);
        doc.fontSize(11).font('Helvetica').text(`Location: ${exp.location}`);
        doc.moveDown(0.5);
        
        doc.text('Responsibilities:');
        (exp.responsibilities || []).forEach(resp => {
          doc.fontSize(11).text(`• ${resp}`);
        });
        doc.moveDown(1);
      });
    }
    
    // Add education
    if (refinedResume.education && refinedResume.education.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000080').text('Education');
      doc.moveDown(0.5);
      
      refinedResume.education.forEach(edu => {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
          .text(`${edu.degree}`);
        doc.fontSize(11).font('Helvetica')
          .text(`${edu.institution}, ${edu.dates}`);
        doc.text(`${edu.location}`);
        doc.moveDown(1);
      });
    }
    
    // Add skills
    if (refinedResume.skills && refinedResume.skills.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000080').text('Skills');
      doc.moveDown(0.5);
      
      const skillsText = Array.isArray(refinedResume.skills) 
        ? refinedResume.skills.join(', ')
        : refinedResume.skills;
      
      doc.fontSize(11).font('Helvetica').fillColor('#000000').text(skillsText);
      doc.moveDown(1);
    }
    
    // Add certifications
    if (refinedResume.certifications && refinedResume.certifications.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000080').text('Certifications');
      doc.moveDown(0.5);
      
      const certsArray = Array.isArray(refinedResume.certifications) 
        ? refinedResume.certifications 
        : [refinedResume.certifications];
      
      certsArray.forEach(cert => {
        doc.fontSize(11).text(`• ${cert}`);
      });
    }
    
    doc.end();
    
    // Wait for PDF to be created
    await pdfPromise;
    
    res.download(outputPath, 'resume.pdf', (err) => {
      if (err) {
        console.error('Error downloading PDF:', err);
      }
      
      // Clean up the file after download
      setTimeout(() => {
        fs.unlink(outputPath, (err) => {
          if (err) console.error('Error deleting temporary PDF:', err);
        });
      }, 1000);
    });
    
  } catch (error) {
    console.error('Error generating PDF resume:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};
const matchCV = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {    
      return res.status(400).json({ message: 'Job description is required' });
    } 
    const userInfo = await getUserInfo();
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    const matchedCV = await matchCVWithAI(userInfo, jobDescription);
    res.json({ success: true, matchedCV });
  } catch (error) {
    console.error('Error matching CV:', error);
    res.status(500).json({ message: 'Error matching CV', error: error.message });
  }
};

module.exports = {
  getUserResume,
  refineResume,
  generatePDFResume,
  matchCV
};
