// src/services/mockJobService.js - Fixed version with consistent data
let cachedJobs = null; // Cache jobs to ensure consistency

const generateJobData = (index) => {
  // Use the index as a seed for consistent random generation
  const seed = index + 1;

  const companies = [
    {
      name: "Google",
      logo: "https://logo.clearbit.com/google.com",
      rating: 4.5,
      size: "10,000+ employees",
    },
    {
      name: "Microsoft",
      logo: "https://logo.clearbit.com/microsoft.com",
      rating: 4.4,
      size: "5,000-10,000 employees",
    },
    {
      name: "Apple",
      logo: "https://logo.clearbit.com/apple.com",
      rating: 4.6,
      size: "10,000+ employees",
    },
    {
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
      rating: 4.1,
      size: "10,000+ employees",
    },
    {
      name: "Meta",
      logo: "https://logo.clearbit.com/meta.com",
      rating: 4.2,
      size: "10,000+ employees",
    },
    {
      name: "Netflix",
      logo: "https://logo.clearbit.com/netflix.com",
      rating: 4.3,
      size: "1,000-5,000 employees",
    },
    {
      name: "Tesla",
      logo: "https://logo.clearbit.com/tesla.com",
      rating: 4.0,
      size: "5,000-10,000 employees",
    },
    {
      name: "Spotify",
      logo: "https://logo.clearbit.com/spotify.com",
      rating: 4.5,
      size: "1,000-5,000 employees",
    },
    {
      name: "Airbnb",
      logo: "https://logo.clearbit.com/airbnb.com",
      rating: 4.3,
      size: "1,000-5,000 employees",
    },
    {
      name: "Uber",
      logo: "https://logo.clearbit.com/uber.com",
      rating: 3.9,
      size: "5,000-10,000 employees",
    },
    {
      name: "Stripe",
      logo: "https://logo.clearbit.com/stripe.com",
      rating: 4.7,
      size: "1,000-5,000 employees",
    },
    {
      name: "Shopify",
      logo: "https://logo.clearbit.com/shopify.com",
      rating: 4.4,
      size: "1,000-5,000 employees",
    },
  ];

  const jobTitles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Senior Software Engineer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
    "UI Designer",
    "DevOps Engineer",
    "Software Engineering Intern",
    "Product Designer",
    "Engineering Manager",
    "Technical Program Manager",
    "Mobile Developer",
    "Machine Learning Engineer",
    "Quality Assurance Engineer",
    "Site Reliability Engineer",
    "Security Engineer",
    "Data Engineer",
  ];

  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Seattle, WA",
    "Austin, TX",
    "Boston, MA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Denver, CO",
    "Remote",
    "London, UK",
    "Toronto, CA",
    "Berlin, Germany",
    "Amsterdam, Netherlands",
    "Dublin, Ireland",
    "Sydney, Australia",
  ];

  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const experienceLevels = ["Entry", "Mid", "Senior", "Lead", "Principal"];

  const skillSets = [
    ["React", "JavaScript", "TypeScript", "Node.js", "CSS"],
    ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
    ["Java", "Spring Boot", "MySQL", "Kubernetes", "AWS"],
    ["Go", "gRPC", "MongoDB", "Kafka", "GCP"],
    ["Swift", "iOS", "Xcode", "Core Data", "SwiftUI"],
    ["Kotlin", "Android", "Jetpack Compose", "Room", "Retrofit"],
    ["React Native", "Expo", "Firebase", "Redux", "Jest"],
    ["Vue.js", "Nuxt.js", "Vuex", "Sass", "Webpack"],
    ["Angular", "TypeScript", "RxJS", "NgRx", "Material UI"],
    ["PHP", "Laravel", "MySQL", "Redis", "Nginx"],
  ];

  const benefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "401(k) Match",
    "Stock Options",
    "Flexible PTO",
    "Remote Work",
    "Professional Development",
    "Gym Membership",
    "Free Meals",
    "Transit Benefits",
    "Parental Leave",
  ];

  const descriptions = [
    "We are looking for a talented engineer to join our growing team and help build the next generation of our platform.",
    "Join our innovative team to work on cutting-edge technology that impacts millions of users worldwide.",
    "Seeking a passionate developer to contribute to our mission of making technology more accessible.",
    "Help us revolutionize the industry by building scalable, high-performance applications.",
    "Be part of a collaborative team that values creativity, innovation, and technical excellence.",
    "Work on challenging problems with the latest technologies in a fast-paced environment.",
    "Join us in creating products that will shape the future of technology and user experience.",
    "We're looking for someone who is excited about building products that make a real difference.",
  ];

  // Use seed to generate consistent "random" selections
  const company = companies[seed % companies.length];
  const title = jobTitles[seed % jobTitles.length];
  const location = locations[seed % locations.length];
  const type = jobTypes[seed % jobTypes.length];
  const skills = skillSets[seed % skillSets.length];
  const isRemote = location === "Remote" || seed % 10 > 7;
  const isFeatured = seed % 10 > 8;
  const isUrgent = seed % 20 > 18;
  const experienceLevel = experienceLevels[seed % experienceLevels.length];

  // Salary based on experience level and job type
  let salaryMin, salaryMax;
  if (type === "internship") {
    salaryMin = 20000 + (seed % 10) * 1000;
    salaryMax = salaryMin + 15000;
  } else {
    const baseMin =
      experienceLevel === "Entry"
        ? 60000
        : experienceLevel === "Mid"
        ? 90000
        : experienceLevel === "Senior"
        ? 130000
        : experienceLevel === "Lead"
        ? 170000
        : 220000;
    salaryMin = baseMin + (seed % 20) * 1000;
    salaryMax = salaryMin + 30000 + (seed % 50) * 1000;
  }

  const postedDaysAgo = seed % 30;
  const postedDate = new Date();
  postedDate.setDate(postedDate.getDate() - postedDaysAgo);

  return {
    id: `job-${seed}`,
    title,
    company: company.name,
    companyLogo: company.logo,
    rating: company.rating,
    companySize: company.size,
    location,
    salary: {
      min: salaryMin,
      max: salaryMax,
      currency: "USD",
    },
    type,
    remote: isRemote,
    featured: isFeatured,
    urgentHiring: isUrgent,
    experienceLevel,
    description: descriptions[seed % descriptions.length],
    skills: skills.slice(0, 3 + (seed % 3)),
    benefits: benefits.slice(0, 4 + (seed % 4)),
    requirements: [
      `${
        experienceLevel === "Entry"
          ? "0-2"
          : experienceLevel === "Mid"
          ? "2-5"
          : experienceLevel === "Senior"
          ? "5+"
          : "8+"
      } years of experience`,
      `Strong knowledge of ${skills[0]} and ${skills[1]}`,
      "Bachelor's degree in Computer Science or related field",
      "Excellent problem-solving and communication skills",
    ],
    posted: postedDate,
    applicationCount: (seed * 17) % 500, // Consistent "random" number
    saved: seed % 10 > 8,
    applied: seed % 20 > 18,
    tags: [
      type,
      experienceLevel.toLowerCase(),
      isRemote ? "remote" : "on-site",
    ],
    industry: "Technology",
    jobFunction: "Engineering",
  };
};

export const generateMockJobs = (count = 50) => {
  // Return cached jobs if already generated
  if (cachedJobs && cachedJobs.length >= count) {
    return cachedJobs.slice(0, count);
  }

  // Generate jobs with consistent data
  const jobs = Array.from({ length: count }, (_, i) => generateJobData(i));

  // Cache the jobs
  cachedJobs = jobs;

  return jobs;
};

// Get a single job by ID
export const getJobById = (jobId) => {
  // Extract the numeric part from the ID (e.g., "job-1" -> 1)
  const numericId = parseInt(jobId.replace("job-", ""));

  if (isNaN(numericId) || numericId < 1) {
    return null;
  }

  // Generate the specific job data for this ID
  return generateJobData(numericId - 1); // Subtract 1 because array is 0-indexed
};

// Clear cache (useful for testing)
export const clearJobsCache = () => {
  cachedJobs = null;
};

export const applyFiltersToJobs = (
  jobs,
  { searchQuery, locationQuery, filters, sortBy }
) => {
  let filtered = [...jobs];

  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  }

  // Apply location query
  if (locationQuery.trim()) {
    const query = locationQuery.toLowerCase();
    filtered = filtered.filter((job) =>
      job.location.toLowerCase().includes(query)
    );
  }

  // Apply date filter
  if (filters.datePosted !== "any") {
    const now = new Date();
    filtered = filtered.filter((job) => {
      const posted = new Date(job.posted);
      const diffTime = now - posted;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      switch (filters.datePosted) {
        case "last-day":
          return diffDays <= 1;
        case "last-week":
          return diffDays <= 7;
        case "last-month":
          return diffDays <= 30;
        default:
          return true;
      }
    });
  }

  // Apply job type filter
  if (filters.jobType && filters.jobType.length > 0) {
    filtered = filtered.filter((job) => filters.jobType.includes(job.type));
  }

  // Apply work setting filter
  if (filters.workSetting !== "any") {
    filtered = filtered.filter((job) => {
      switch (filters.workSetting) {
        case "remote":
          return job.remote;
        case "on-site":
          return !job.remote;
        case "hybrid":
          return job.location.toLowerCase().includes("hybrid");
        default:
          return true;
      }
    });
  }

  // Apply salary filter
  if (filters.salaryRange) {
    filtered = filtered.filter(
      (job) =>
        job.salary.max >= filters.salaryRange.min &&
        job.salary.min <= filters.salaryRange.max
    );
  }

  // Apply experience level filter
  if (filters.experienceLevel && filters.experienceLevel.length > 0) {
    filtered = filtered.filter((job) =>
      filters.experienceLevel.some(
        (level) => job.experienceLevel.toLowerCase() === level.toLowerCase()
      )
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.posted) - new Date(a.posted);
      case "oldest":
        return new Date(a.posted) - new Date(b.posted);
      case "salary_high":
        return b.salary.max - a.salary.max;
      case "salary_low":
        return a.salary.min - b.salary.min;
      case "company":
        return a.company.localeCompare(b.company);
      case "relevance":
      default:
        // Sort by featured first, then by posting date
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.posted) - new Date(a.posted);
    }
  });

  return filtered;
};
