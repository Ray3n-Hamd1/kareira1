// Mock user service - in production this would connect to your database
async function getUserInfo() {
  // This function provides the same mock data as the Python get_user_info() function
  return {
    "name": "Mohamed Hachicha",
    "title": "AI Engineer/Developer, Actuary",
    "email": "hachichamohamed2001@gmail.com",
    "location": "Petite Ariana, Tunisia",
    "phone": "+216 26702119",
    "linkedin": "www.linkedin.com/in/MohamedHachicha",
    "about": "AI enthusiast pursuing a Master's in Actuarial Science with over 2 years of experience in AI development and machine learning. I specialize in Generative AI and Computer Vision, aiming to solve complex problems and drive impactful results.",
    "professional_experience": [
      {
        "job_title": "Team Lead, AI Developer",
        "company": "LabLab / Openai Hackathon",
        "dates": "February 2024—March 2024",
        "location": "San Francisco, USA / Remote",
        "responsibilities": [
          "Led the development of an educational platform for children with ADHD, resulting in a 40% increase in learning engagement.",
          "Managed a team to win first place in the LabLab.ai hackathon.",
          "Utilized Streamlit, RAG Technique, Pinecone, and OpenAI APIs to build and deploy the platform."
        ]
      },
      {
        "job_title": "Team Lead, AI Developer",
        "company": "Agile Loop Hackathon",
        "dates": "May 2024—June 2024",
        "location": "London, UK / Remote",
        "responsibilities": [
          "Designed Dude AI, a conversational AI assistant for daily task management.",
          "Integrated Gemini Flash, Microsoft Azure, and Google Cloud APIs."
        ]
      },
      {
        "job_title": "Lead Developer",
        "company": "Freelance",
        "dates": "April 2024",
        "location": "Tunis, Tunisia",
        "responsibilities": [
          "Developed IcharaAI, a sign language translator and educational platform for the deaf community.",
          "Leveraged AI technologies like Blender, TypeScript, Pinecone, and Ollama."
        ]
      },
      {
        "job_title": "Lead Data Scientist",
        "company": "Freelance",
        "dates": "August 2024—Present",
        "location": "Qatar / Remote",
        "responsibilities": [
          "Developed a model for predicting cryptocurrency market trends using time series analysis and LSTM models.",
          "Analyzed market data to enhance prediction accuracy."
        ]
      },
      {
        "job_title": "AI Developer",
        "company": "Udini (Dental AI)",
        "dates": "June 2024",
        "location": "Sfax, Tunisia",
        "responsibilities": [
          "Built SneniAI dental image segmentation models using YOLOv9, ResNet-50, and Faster R-CNN.",
          "Achieved a 15% improvement in diagnostic accuracy."
        ]
      }
    ],
    "education": [
      {
        "degree": "Master's in Actuarial Science",
        "institution": "Le Mans University",
        "dates": "2023—Present",
        "location": "Le Mans, France"
      },
      {
        "degree": "Data Engineering and Artificial Intelligence",
        "institution": "ESPRIT University",
        "dates": "2022—Present",
        "location": "Tunis, Tunisia"
      },
      {
        "degree": "Preparatory School in Math, Physics, and Technology",
        "institution": "IPEIS University",
        "dates": "2020—2022",
        "location": "Sfax, Tunisia"
      }
    ],
    "certifications": [
      "Nvidia Building Transformer-Based Natural Language Processing Applications",
      "Nvidia Fundamentals of Deep Learning",
      "LabLab Next Hackathon",
      "Nvidia Applications of AI for Predictive Maintenance"
    ],
    "skills": [
      "Python", "JavaScript", "TypeScript", "SQL", "NOSQL",
      "Generative AI", "LSTM", "YOLOv9", "OpenAI API",
      "Flask", "React", "TensorFlow", "Keras", "FastAPI"
    ],
    "languages": [
      {
        "language": "Arabic",
        "proficiency": "Native/Bilingual"
      },
      {
        "language": "English",
        "proficiency": "Full professional proficiency"
      },
      {
        "language": "French",
        "proficiency": "Native/Bilingual"
      }
    ]
  };
}

module.exports = { getUserInfo };
