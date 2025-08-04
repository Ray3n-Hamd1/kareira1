const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Clean text for PDF
function sanitizeText(text) {
  if (!text) return '';
  if (typeof text !== 'string') return String(text);
  
  // Replace problematic characters
  return text
    .replace(/\u2013|\u2014/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

// Generate PDF resume
async function generatePDFResume(resumeData) {
  try {
    const outputPath = path.join(__dirname, '../uploads', `resume-${Date.now()}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    
    // Create a promise to track when PDF is finished
    const pdfPromise = new Promise((resolve, reject) => {
      doc.pipe(stream);
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
    
    // Add content to PDF
    // Header section
    const name = sanitizeText(resumeData.name || '');
    const title = sanitizeText(resumeData.title || '');
    const email = sanitizeText(resumeData.email || '');
    const phone = sanitizeText(resumeData.phone || '');
    const location = sanitizeText(resumeData.location || '');
    
    doc.fontSize(18).font('Helvetica-Bold').text(`${name}${title ? `, ${title}` : ''}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`${email} | ${phone} | ${location}`, { align: 'center' });
    doc.moveDown(1);
    
    // Add about section if present
    if (resumeData.about) {
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('PROFESSIONAL SUMMARY');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#000000').text(sanitizeText(resumeData.about));
      doc.moveDown(1);
    }
    
    // Add experience section
    if (resumeData.professional_experience && resumeData.professional_experience.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('PROFESSIONAL EXPERIENCE');
      doc.moveDown(0.5);
      
      resumeData.professional_experience.forEach(exp => {
        const jobTitle = sanitizeText(exp.job_title || '');
        const company = sanitizeText(exp.company || '');
        const dates = sanitizeText(exp.dates || '');
        const location = sanitizeText(exp.location || '');
        
        doc.fontSize(11).font('Helvetica-Bold').text(`${jobTitle} - ${company}`);
        doc.fontSize(10).font('Helvetica-Oblique').text(`${dates} | ${location}`);
        doc.moveDown(0.5);
        
        if (exp.responsibilities && exp.responsibilities.length) {
          doc.fontSize(10).font('Helvetica').text('Key Responsibilities:');
          
          exp.responsibilities.forEach(resp => {
            doc.fontSize(10).font('Helvetica').text(`• ${sanitizeText(resp)}`, {
              indent: 15,
              align: 'left',
              lineGap: 2
            });
          });
        }
        
        doc.moveDown(1);
      });
    }
    
    // Add education section
    if (resumeData.education && resumeData.education.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('EDUCATION');
      doc.moveDown(0.5);
      
      resumeData.education.forEach(edu => {
        const degree = sanitizeText(edu.degree || '');
        const institution = sanitizeText(edu.institution || '');
        const dates = sanitizeText(edu.dates || '');
        const location = sanitizeText(edu.location || '');
        
        doc.fontSize(11).font('Helvetica-Bold').text(degree);
        doc.fontSize(10).font('Helvetica').text(`${institution}`);
        doc.fontSize(10).font('Helvetica-Oblique').text(`${dates} | ${location}`);
        doc.moveDown(1);
      });
    }
    
    // Add skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('SKILLS');
      doc.moveDown(0.5);
      
      let skillsText = '';
      if (Array.isArray(resumeData.skills)) {
        skillsText = resumeData.skills.join(' • ');
      } else {
        skillsText = resumeData.skills;
      }
      
      doc.fontSize(10).font('Helvetica').text(sanitizeText(skillsText));
      doc.moveDown(1);
    }
    
    // Add certifications section
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('CERTIFICATIONS');
      doc.moveDown(0.5);
      
      if (Array.isArray(resumeData.certifications)) {
        resumeData.certifications.forEach(cert => {
          doc.fontSize(10).font('Helvetica').text(`• ${sanitizeText(cert)}`);
        });
      } else {
        doc.fontSize(10).font('Helvetica').text(sanitizeText(resumeData.certifications));
      }
    }
    
    // Finalize the PDF
    doc.end();
    
    return pdfPromise;
  } catch (error) {
    console.error('Error generating PDF resume:', error);
    throw new Error('PDF generation failed');
  }
}

module.exports = { generatePDFResume };
