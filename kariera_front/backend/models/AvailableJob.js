// backend/models/AvailableJob.js - Model for scraped/available jobs
const mongoose = require('mongoose');

const availableJobSchema = new mongoose.Schema({
  // Unique job identifier
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Basic job information
  title: {
    type: String,
    required: true
  },
  
  company: {
    type: String,
    required: true
  },
  
  location: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  // Job details
  jobUrl: {
    type: String,
    required: true
  },
  
  isRemote: {
    type: Boolean,
    default: false
  },
  
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full-time'
  },
  
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Executive'],
    default: 'Entry Level'
  },
  
  // Salary information
  salaryMin: {
    type: Number,
    default: null
  },
  
  salaryMax: {
    type: Number,
    default: null
  },
  
  salaryCurrency: {
    type: String,
    default: 'USD'
  },
  
  // Skills and requirements
  skills: [{
    type: String
  }],
  
  requirements: [{
    type: String
  }],
  
  benefits: [{
    type: String
  }],
  
  // Company information
  companySize: {
    type: String,
    enum: ['Startup', 'Small', 'Medium', 'Large', 'Enterprise']
  },
  
  industry: {
    type: String
  },
  
  // Posting information
  postedAt: {
    type: Date,
    default: Date.now
  },
  
  expiresAt: {
    type: Date
  },
  
  source: {
    type: String,
    required: true,
    default: 'scraped'
  },
  
  sourceUrl: {
    type: String
  },
  
  // Application tracking
  applicationCount: {
    type: Number,
    default: 0
  },
  
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isExpired: {
    type: Boolean,
    default: false
  },
  
  // Vector embeddings for AI matching
  embeddings: [{
    type: Number
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
availableJobSchema.index({ title: 'text', description: 'text', company: 'text' });
availableJobSchema.index({ location: 1 });
availableJobSchema.index({ isRemote: 1 });
availableJobSchema.index({ jobType: 1 });
availableJobSchema.index({ postedAt: -1 });
availableJobSchema.index({ isActive: 1 });
availableJobSchema.index({ id: 1 }, { unique: true });

// Pre-save middleware to update timestamps
availableJobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Methods
availableJobSchema.methods.incrementViewCount = function() {
  this.viewCount = (this.viewCount || 0) + 1;
  return this.save();
};

availableJobSchema.methods.incrementApplicationCount = function() {
  this.applicationCount = (this.applicationCount || 0) + 1;
  return this.save();
};

availableJobSchema.methods.markAsExpired = function() {
  this.isExpired = true;
  this.isActive = false;
  return this.save();
};

// Static methods
availableJobSchema.statics.findActive = function() {
  return this.find({ isActive: true, isExpired: false });
};

availableJobSchema.statics.findByLocation = function(location) {
  return this.find({
    location: { $regex: location, $options: 'i' },
    isActive: true,
    isExpired: false
  });
};

availableJobSchema.statics.findRemoteJobs = function() {
  return this.find({
    isRemote: true,
    isActive: true,
    isExpired: false
  });
};

availableJobSchema.statics.searchJobs = function(query) {
  return this.find({
    $text: { $search: query },
    isActive: true,
    isExpired: false
  }).sort({ score: { $meta: 'textScore' } });
};

const AvailableJob = mongoose.model('AvailableJob', availableJobSchema);

module.exports = AvailableJob;