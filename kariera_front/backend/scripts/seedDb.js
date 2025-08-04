const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Resume = require('../models/Resume');

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kariera';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Resume.deleteMany({});
    
    // Create a demo user
    console.log('Creating demo user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@kariera.com',
      password: hashedPassword
    });
    
    const savedUser = await demoUser.save();
    console.log(`Demo user created with ID: ${savedUser._id}`);
    
    // Create a sample resume for the demo user
    console.log('Creating sample resume...');
    const sampleResume = new Resume({
      user: savedUser._id,
      personalInfo: {
        fullName: 'Demo User',
        jobTitle: 'Full Stack Developer',
        email: 'demo@kariera.com',
        phone: '123-456-7890',
        address: '123 Main St, City, Country'
      },
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of Technology',
          city: 'San Francisco',
          country: 'USA',
          startMonth: 'September',
          startYear: '2015',
          endMonth: 'May',
          endYear: '2019',
          description: 'Graduated with honors. Specialized in web technologies and artificial intelligence.'
        }
      ],
      experience: [
        {
          jobTitle: 'Frontend Developer',
          employer: 'Tech Solutions Inc.',
          city: 'San Francisco',
          country: 'USA',
          startMonth: 'June',
          startYear: '2019',
          endMonth: 'December',
          endYear: '2021',
          isPresent: false,
          description: 'Developed responsive web applications using React, Redux, and TypeScript. Collaborated with design team to implement UI/UX improvements.'
        },
        {
          jobTitle: 'Full Stack Developer',
          employer: 'Innovative Apps LLC',
          city: 'San Francisco',
          country: 'USA',
          startMonth: 'January',
          startYear: '2022',
          endMonth: '',
          endYear: '',
          isPresent: true,
          description: 'Working on end-to-end web applications using the MERN stack (MongoDB, Express, React, Node.js). Implementing CI/CD pipelines for automated testing and deployment.'
        }
      ],
      projects: [
        {
          projectTitle: 'E-commerce Platform',
          subTitle: 'Full Stack Development',
          city: 'San Francisco',
          country: 'USA',
          startMonth: 'March',
          startYear: '2020',
          endMonth: 'August',
          endYear: '2020',
          isPresent: false,
          description: 'Developed a fully functional e-commerce platform with payment processing, inventory management, and user authentication.'
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Git', 'Docker', 'AWS']
    });
    
    const savedResume = await sampleResume.save();
    console.log(`Sample resume created with ID: ${savedResume._id}`);
    
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

seedDatabase();
