# Kariera Backend API

This is the backend API server for Kariera job search platform.

## Setup Instructions

1. Install dependencies:
   ```
   npm run install-deps
   # or
   node install-all.js
   ```

2. Configure environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/kariera
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_INDEX_NAME=kariera-jobs
   GEMINI_API_KEY=AIzaSyCTGDo0PTvddLf3u5AZxN8OOsBJxLEuMMo
   
   # Azure OpenAI Embedding Configuration
   AZURE_EMBEDDING_ENDPOINT="https://houkouk.openai.azure.com/"
   AZURE_EMBEDDING_API_KEY="4lPOeVJM6ep1ISlV9Cc78tpDVi2OcW8w1z65eh7BmZGMphM6BsqMJQQJ99BAAC5T7U2XJ3w3AAABACOGviis"
   AZURE_EMBEDDING_DEPLOYMENT_NAME="text-embedding-3-large"
   AZURE_EMBEDDING_API_VERSION="2024-02-15-preview"
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The server will be running at http://localhost:5000

## API Endpoints

### Job Search
- POST `/api/jobs/recommendations` - Get job recommendations based on uploaded resume

### Cover Letter
- POST `/api/cover-letter/generate` - Generate a cover letter for a job listing

### Resume
- GET `/api/resume` - Get user's resume data
- POST `/api/resume/refine` - Refine a resume for a specific country
- POST `/api/resume/generate-pdf` - Generate a PDF from resume data
