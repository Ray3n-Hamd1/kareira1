from flask import Flask, render_template , session, request, jsonify , send_file , abort
import csv
from apscheduler.schedulers.background import BackgroundScheduler
import pandas as pd
import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_together.embeddings import TogetherEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pinecone import Pinecone
from llama_parse import LlamaParse
import openai
import glob
import google.generativeai as genai
import json
from jobspy import scrape_jobs
from openai import OpenAI
from fpdf import FPDF
import traceback
#                                                    env variables loading
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
# -------------------------------------------------------------------------------------------------------------------------

#                                                   cofiguring the LLMs Used 
genai.configure(api_key=GEMINI_API_KEY)
model_internquest = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})
client = OpenAI(api_key=OPENAI_API_KEY)
# -------------------------------------------------------------------------------------------------------------------------

#                                           Ensure the directory to save files exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# -------------------------------------------------------------------------------------------------------------------------

#                                           Starting the flask application
app = Flask(__name__)
app.secret_key = 'akjezrghualezhrulaehr'
@app.route('/')
# -------------------------------------------------------------------------------------------------------------------------

#                                           the index html is the main page

@app.route('/index.html')
def index():
    return render_template('index.html', the_title='Tiger Home Page')
# -------------------------------------------------------------------------------------------------------------------------

#                                           the cover_letter_generator html

@app.route('/generate_cover_letter')
def generate_cover_letter_page():
    return render_template('cover_letter_generator.html')
# -------------------------------------------------------------------------------------------------------------------------

#                                              the refined_resume html

@app.route('/refine_resume')
def refine_resume_page():
    return render_template('refined_resume.html')
# -------------------------------------------------------------------------------------------------------------------------

#                                              defining the webscraper function                                            

def webscraper():
    jobs = scrape_jobs(
        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
        search_term="IT",
        job_type="internship",
        results_wanted=15,
        hours_old=24,
        country_indeed="france"
    )

    jobs['is_remote'].fillna(0, inplace=True)
    print(f"Found {len(jobs)} jobs")

    selected_columns = ['id', 'location', 'title', 'job_url', 'is_remote', 'description','company']
    selected_jobs = jobs[selected_columns]
    selected_jobs = selected_jobs.dropna(subset=['description','job_url'])

    file_path = "csv_Files/jobs.csv"

    if os.path.exists(file_path):
        existing_jobs = pd.read_csv(file_path)
        # Find new jobs that are not duplicates
        new_jobs = selected_jobs[~selected_jobs['id'].isin(existing_jobs['id'])]
        updated_jobs = pd.concat([existing_jobs, new_jobs])
        updated_jobs.drop_duplicates(subset=['id'], keep='last', inplace=True)
    else:
        new_jobs = selected_jobs
        updated_jobs = selected_jobs

    # Save updated jobs to CSV
    updated_jobs.to_csv(file_path, quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False)

    print(f"Appended {len(new_jobs)} new jobs to csv file.")

    if not new_jobs.empty:
        # Embed and store new jobs in your vector database
        embed_and_store(new_jobs)

    return None
# -------------------------------------------------------------------------------------------------------------------------

#                                defining the embeding function + storing in the Vector-database

def embed_and_store(new_jobs):
    # Replace NaN with an empty string or some default value
    new_jobs.fillna('', inplace=True)

    combined_texts = new_jobs.apply(
        lambda row: ' '.join([str(row[col]) for col in new_jobs.columns]), axis=1
    ).tolist()
    print(combined_texts[:5])  # Debugging print statement

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=70)
    texts = [chunk for text in combined_texts for chunk in text_splitter.split_text(text)]
    print(texts[:5])  # Debugging print statement
    if EMBEDDING_PROVIDER == "togetherai":
        embeddings = TogetherEmbeddings(api_key="88a0c47be93cb6f9005f17cdee427a8bf4af9a9cbea5488cf19b175d616249c1", model="togethercomputer/m2-bert-80M-8k-retrieval")
    if EMBEDDING_PROVIDER == "openai":
        embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    try:
        vectors = embeddings.embed_documents(texts)
    except Exception as e:
        print(f"Error embedding documents: {e}")
        return  # Exit the function if there's an error

    print(vectors[:5])  # Debugging print statement

    # Initialize Pinecone
    print("PINECONE_API_KEY : " + PINECONE_API_KEY + "\n")
    pc = Pinecone(api_key="60d532c4-35a5-4ca1-8316-1ff1aba2b6a5")
    index = pc.Index(INDEX_NAME)

    # Prepare the IDs and metadata
    ids = new_jobs['id'].astype(str).tolist()
    job_metadata = new_jobs[['id', 'location', 'title', 'job_url', 'is_remote', 'description','company']].to_dict(orient='records')
    print(job_metadata[:5])  # Debugging print statement

    # Prepare the vectors with IDs and metadata
    vectors_with_metadata = [
        {"id": id_, "values": vector, "metadata": metadata} 
        for id_, vector, metadata in zip(ids, vectors, job_metadata)
    ]

    # Validate the vectors_with_metadata structure
    for item in vectors_with_metadata[:5]:
        print(item)  # Debugging print statement

    try:
        # Upsert the vectors into Pinecone
        index.upsert(vectors=vectors_with_metadata)
        print("Embedded and stored the new job rows in the vector database.")
    except Exception as e:
        print(f"Error during upsert: {e}")
# -------------------------------------------------------------------------------------------------------------------------

#                                 defining the parsing and refactoring function + vector search 

def parse_search(number_of_jobs=4,country="usa",job_title="intership"):
    parser = LlamaParse(result_type="markdown")
    documents = parser.load_data(glob.glob("uploads/*.pdf"))
    print(documents)
    document = documents[0].text

    messages = f"""
    You are a CV filter system. Use these informations in the CV: '{document}'. Note that the output should be in JSON format:
    {{
        "Informations": [
            {{
                "job_to_search_for": str,
                "Work Experience": str (example: 2 years),
                "Key_Responsibilities_and_Achievements": [str, str, str, ...],
                "Skills": [str, str, str, str, ...],
                "Certifications": [str, str, str, ...],
                "Projects": [str, str, str, ...],
                "recap": str
            }}
        ]
    }}
    """
    
    response = model_internquest.generate_content(
        messages,
        generation_config=genai.GenerationConfig(temperature=0)
    )
    print("\n" + "*"*60 + " Internships : " + response.text + "*"*60 + "\n")
    json_response = json.loads(response.text)
    
    info = json_response["Informations"][0]

    job_to_search_for = info["job_to_search_for"]
    work_experience = info["Work Experience"]
    responsibilities = ", ".join(info["Key_Responsibilities_and_Achievements"])
    skills = ", ".join(info["Skills"])
    certifications = ", ".join(info["Certifications"])
    projects = ", ".join(info["Projects"])
    recap = info["recap"]

    paragraph = (
        f"{recap} With {work_experience} of work experience im searshing for '{job_title}' as my job_title in country : '{country}', I have "
        f"been responsible for {responsibilities}. My skills include {skills}. "
        f"I have earned certifications such as {certifications}, and I have worked on projects like {projects}."
    )
    print(paragraph)

    pc = Pinecone(api_key="60d532c4-35a5-4ca1-8316-1ff1aba2b6a5")
    index = pc.Index(INDEX_NAME)

    if EMBEDDING_PROVIDER == "togetherai":
        embeddings = TogetherEmbeddings(api_key="88a0c47be93cb6f9005f17cdee427a8bf4af9a9cbea5488cf19b175d616249c1", model="togethercomputer/m2-bert-80M-8k-retrieval")
    if EMBEDDING_PROVIDER == "openai":
        embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)    
    vector = embeddings.embed_query(paragraph)
    print(vector)  # Debugging print statement

    results = index.query(
    vector=vector,
    top_k=int(number_of_jobs),
    include_values=False,
    include_metadata=True
    )
    combined_descriptions = []
    
    for match in results['matches']:
        description = match['metadata'].get('description', '').strip()
        job_url = match['metadata'].get('job_url', '').strip()
        job_location = match['metadata'].get('location', '').strip()
        
        # Create the combined description with location, description, and job URL
        combined_description = ""
        
        if description:
            combined_description += f"{description}\n"
        
        if job_location:
            combined_description += f"Location: {job_location}\n"
        
        if job_url:
            combined_description += f"Job URL: {job_url}"
        
        if not combined_description:
            combined_description = "No description, location, or URL available"
        
        combined_descriptions.append(combined_description)
    
    # Join all descriptions with a separator
    all_descriptions = "\n\n---\n\n".join(combined_descriptions)
    
    # Clean up any excessive whitespace
    all_descriptions = ' '.join(all_descriptions.split())
    
    return all_descriptions
# -------------------------------------------------------------------------------------------------------------------------

#                                defining the jobs refactoring function after the search

def internships(parse_search_result):
    messages = """
    You are an internship recommandation system. Use these search results : """ + parse_search_result + """'. Note that the output should be in JSON format and make sure the JSON is correct:
    {{
        "jobs": [
            {{
                "jobTitle": "Brand Marketing Intern",
                "link": "https://www.example.com/job/brand-marketing-intern",
                "description": "Assist with marketing campaigns",
                "location": "Chicago, IL"
            }},
            {{
                "jobTitle": "Software Engineering Intern",
                "link": "https://www.example.com/job/software-engineering-intern",
                "description": "Work on backend systems",
                "location": "San Francisco, CA"
            }},
            {{
                "jobTitle": "Data Analyst Intern",
                "link": "https://www.example.com/job/data-analyst-intern",
                "description": "Analyze business data",
                "location": "New York, NY"
            }},
            {{
                "jobTitle": "UX Design Intern",
                "link": "https://www.example.com/job/ux-design-intern",
                "description": "Design user experiences",
                "location": "Austin, TX"
            }},
            {{
                "jobTitle": "Finance Intern",
                "link": "https://www.example.com/job/finance-intern",
                "description": "Assist with financial modeling",
                "location": "Boston, MA"
            }}
        ]
    }}

    """
     
    try:        
        response = model_internquest.generate_content(
            messages,
            generation_config=genai.GenerationConfig(
                temperature=0
            )
        )
        print("\n" + "*"*60 + " Internships : " + response.text + "*"*60 + "\n")
        json_response = json.loads(response.text)
        
        output = json_response.get("jobs", [])     
        print(output)   
        return output            
    except Exception as e:
        print(f"Error generating content: {e}")
        return None           

# -------------------------------------------------------------------------------------------------------------------------

#                                               defining the save pdf function

@app.route('/save_pdf', methods=['POST'])
def save_pdf():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if file and file.filename.endswith('.pdf'):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        return render_template('index.html', filename=file.filename)
    else:
        return jsonify({'message': 'Invalid file format. Only PDFs are allowed.'}), 400
# -------------------------------------------------------------------------------------------------------------------------

#                                defining the route to render the internships found

@app.route('/get_internships', methods=['POST'])
def get_internships():  
    country = request.form.get('Country')
    job_title = request.form.get('Job_Title')
    number_of_jobs = request.form.get('Number_Of_Jobs')
    parse_result = parse_search(number_of_jobs,country,job_title)
    output = internships(parse_result)
    print("Debug - output:", output)  # Add this line
    session['Jobs'] = output
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)
    return(render_template("index.html", jobs=output))
# -------------------------------------------------------------------------------------------------------------------------

def get_user_info():
    # This function should be modified to get user info from a form or database
    # For now, we'll use a dummy function
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
    }

# -------------------------------------------------------------------------------------------------------------------------

#                                               Generate cover letter function
def generate_cover_letter(user_info, job_info):
    user_name = user_info["name"]
    user_skills = user_info["skills"]
    user_experience = ", ".join([job["job_title"] + " at " + job["company"] for job in user_info["professional_experience"]])
    user_certifications = user_info["certifications"]
    # user_name = "Hachicha Mohamed"
    # user_skills = "PHP"
    # user_experience = ""
    # user_certifications = "Nvidia"

    prompt = f"""
    Generate a professional and ATS-friendly cover letter for a job application. The applicant is {user_name}, applying for the position of {job_info['job_title']} at {job_info['company']}, located in {job_info['location']}. The applicant has skills in {user_skills}, with experience in {user_experience}, and holds the following certifications: {user_certifications}. The job description is: {job_info['description']}.

    The cover letter should:
    - Begin with a brief introduction stating the applicant's interest in the position.
    - Highlight only the most relevant skills and experiences that match the job requirements. Focus on those that directly relate to {job_info['job_title']} and the responsibilities listed in the job description.
    - Avoid placeholders like [Your Name], [Your Address], [Your Phone Number], [Your Email Address], [Date], or any reference to where the job was advertised.
    - Focus on specific achievements related to the job description rather than general experience.
    - End with a strong conclusion, emphasizing the applicant's enthusiasm for the role and inviting further discussion.
    - Make it sound very human like. 
    - Ensure the cover letter is concise and does not exceed 400 words.
    
    make the response is in this JSON format : 
    {{
    "to": "str",
    "from": "str",
    "subject": "str",
    "body": "str"
    }}
    """
    response = model_internquest.generate_content(prompt)
    return response.text
# -------------------------------------------------------------------------------------------------------------------------

#                                       Refine user data function
def refine_user_data_with_gemini(user_info, target_country):
    user_info_str = "\n".join([f"{key}: {value}" for key, value in user_info.items()])
    # user_name = "Hachicha Mohamed"
    # user_skills = "PHP"
    # user_experience = ", "
    # user_certifications = "Nvidia"
    # user_info_str = f"name : {user_name} , skills : {user_skills} , experience : {user_experience} ,certifications : {user_certifications}"
    prompt = f"""Refine the following resume information for a position in {target_country}. 
    Ensure it is professional, ATS-friendly, and highlights the most relevant aspects. 
    Use the details provided:

    {user_info_str}

    Please expand on this information to create a comprehensive resume profile.
    - Use the information provided to elaborate. 
    - I want the version you output to be final. 
    - Elaborate within my capabilities; I do not want things I did not do to be on the resume. 
    - Do the best job you can.
    """

    response = model_internquest.generate_content(prompt)
    return response.text.strip()
# -------------------------------------------------------------------------------------------------------------------------

#                                               preprocess_text
def preprocess_text(text):
    # Replace unsupported characters with a placeholder
    text = text.replace("\u2013", "-").replace("\u2014", "-").replace("’", "'").replace("“", '"').replace("”", '"')
    return text
# -------------------------------------------------------------------------------------------------------------------------

#                                               PDF generation class
class PDFResume(FPDF):
    def sanitize_text(self, text):
        if isinstance(text, dict):
            # If text is a dict, return it as is
            return text
        return (text)  # Handle ellipses
    
    def add_header(self, name, contact_info):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, name, ln=True, align='C')
        self.set_font('Arial', '', 12)
        self.cell(0, 10, contact_info, ln=True, align='C')
        self.ln(10)

    def add_section(self, title, content):
        self.set_font('Arial', 'B', 14)
        self.set_text_color(0, 0, 128)
        self.cell(0, 10, title, ln=True)
        self.ln(4)
        
        self.set_font('Arial', '', 12)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 10, content)
        self.ln()

    def generate_resume(self, resume_data):
        self.add_page()

        # Adding Header (Name, Contact Info)
        name = f"{resume_data.get('name', '')}, {resume_data.get('title', '')}"
        contact_info = f"{resume_data.get('email', '')} | {resume_data.get('phone', '')} | {resume_data.get('location', '')}"
        self.add_header(name, contact_info)

        # Adding sections like Professional Experience, Education, etc.
        if 'professional_experience' in resume_data:
            for experience in resume_data['professional_experience']:
                job_title = experience.get('job_title', '')
                company = experience.get('company', '')
                dates = experience.get('dates', '')
                location = experience.get('location', '')
                responsibilities = "\n".join(experience.get('responsibilities', []))
                section_title = f"{job_title} at {company} ({dates})"
                section_content = f"Location: {location}\n\nResponsibilities:\n{responsibilities}"
                self.add_section(preprocess_text(section_title), preprocess_text(section_content))

        # Similarly, add other sections like education, skills, etc.
        if 'education' in resume_data:
            self.add_section("Education", preprocess_text(resume_data['education']))

        if 'skills' in resume_data:
            self.add_section("Skills", preprocess_text(resume_data['skills']))

        if 'volunteer_experience' in resume_data:
            self.add_section("Volunteer Experience", preprocess_text(resume_data['volunteer_experience']))

        output_path = "formatted_resume.pdf"
        self.output(output_path)
        return output_path
# -------------------------------------------------------------------------------------------------------------------------

#                                       New route for generating cover letter
@app.route('/generate_cover_letter', methods=['POST'])
def generate_cover_letter_route():
    user_info = get_user_info()
    job_info = request.json
    cover_letter = generate_cover_letter(user_info, job_info)
    return jsonify({"cover_letter": cover_letter})
# -------------------------------------------------------------------------------------------------------------------------

#                                            New route for refining resume
@app.route('/refine_resume', methods=['POST'])
def refine_resume_route():
    user_info = get_user_info()
    target_country = request.json.get('target_country', 'USA')
    refined_resume = refine_user_data_with_gemini(user_info, target_country)
    return jsonify({"refined_resume": refined_resume})
# -------------------------------------------------------------------------------------------------------------------------

#                                          New route for generating PDF resume
@app.route('/generate_pdf_resume', methods=['POST'])
def generate_pdf_resume_route():
    try:
        # Get the resume data from the request and check if it's a string
        resume_data = request.get_json().get('refined_resume')
        
        # If resume_data is a string, try parsing it into a dictionary
        if isinstance(resume_data, str):
            try:
                resume_data = json.loads(resume_data)
            except json.JSONDecodeError:
                return "Invalid resume data format", 400

        # Ensure that the resume_data is a dictionary
        if isinstance(resume_data, dict):
            pdf = PDFResume()  # Your PDF generator class
            output_path = pdf.generate_resume(resume_data)
            
            # Check if the PDF file was created successfully
            if os.path.exists(output_path):
                return send_file(output_path, as_attachment=True, mimetype='application/pdf')
            else:
                return "PDF generation failed", 500
        else:
            return "Invalid resume data", 400

    except Exception as e:
        # Log the exception for debugging
        app.logger.error(f"Error generating PDF: {e}")
        return "An error occurred while generating the PDF", 500


# -------------------------------------------------------------------------------------------------------------------------

#                                                the main function
if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    # schedular to trigger every day at the given time (00:00)
    scheduler.add_job(func=webscraper, trigger="cron", hour=16, minute=1)
    scheduler.start()
    print(app.template_folder)
    
    
    
    
    
    app.run(debug=True)