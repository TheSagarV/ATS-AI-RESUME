# ATS AI Resume Builder

An intelligent, AI-powered resume builder designed to help job seekers create Applicant Tracking System (ATS) friendly resumes. This application leverages Google's Gemini AI to parse existing resumes, optimize content based on job descriptions, and generate professional, high-quality PDF resumes.

## 🚀 Features

-   **AI Resume Parsing**: Automatically extracts personal details, education, experience, and skills from existing resumes.
-   **Smart Optimization**: Tailors your resume to specific job descriptions using advanced AI prompts to increase ATS compatibility.
-   **ATS Scoring**: Provides an ATS compatibility score (0-100) with actionable feedback and suggestions for improvement.
-   **Professional Templates**: Generates clean, structured, and ATS-friendly PDF resumes.
-   **Real-time Editing**: Interactive form for manual adjustments and fine-tuning.
-   **PDF Export**: High-quality PDF generation using PDFKit and Puppeteer.

## 🛠️ Tech Stack

### Frontend
-   **React**: UI library for building interactive interfaces.
-   **Vite**: Fast build tool and development server.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **Framer Motion**: For smooth animations and transitions.
-   **Axios**: For API communication.

### Backend
-   **Node.js & Express**: Robust backend server.
-   **Google Generative AI (Gemini)**: Powering the core AI features for parsing and optimization.
-   **PostgreSQL**: Database for storing user data and resumes.
-   **PDFKit & Puppeteer**: Tools for generating and manipulating PDFs.
-   **Multer**: Middleware for handling file uploads.

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ats-ai-resume-builder.git
    cd ats-ai-resume-builder
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../ats-ai-frontend
    npm install
    ```

4.  **Environment Configuration**
    -   Create a `.env` file in the `backend` directory.
    -   Add your API keys and database credentials (e.g., `GEMINI_API_KEY`, `DB_CONNECTION_STRING`).

5.  **Run the Application**
    -   Start the backend:
        ```bash
        cd backend
        npm run dev
        ```
    -   Start the frontend:
        ```bash
        cd ats-ai-frontend
        npm run dev
        ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
