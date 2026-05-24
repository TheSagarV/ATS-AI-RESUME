<div align="center">

# 📄 ATS AI Resume Builder

**An intelligent, AI-powered resume builder designed to help job seekers create Applicant Tracking System (ATS) friendly resumes.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ats-ai-resume-sigma.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🚀 Overview

The ATS AI Resume Builder is a modern web application that leverages Google's Gemini AI to parse existing resumes, optimize content based on specific job descriptions, and generate professional, high-quality PDF resumes that pass through automated Applicant Tracking Systems (ATS).

<br/>

## ✨ Key Features

- 🧠 **AI Resume Parsing**: Automatically extracts personal details, education, experience, and skills from existing resumes.
- 🎯 **Smart Optimization**: Tailors your resume to specific job descriptions using advanced AI prompts to increase ATS compatibility.
- 📊 **ATS Scoring**: Provides an ATS compatibility score (0-100) with actionable feedback and suggestions for improvement.
- 🎨 **Professional Templates**: Generates clean, structured, and ATS-friendly PDF resumes with multiple design & font choices (e.g., Sans, Serif, Mono, Poppins).
- ✍️ **Real-time Editing**: Interactive form for manual adjustments and fine-tuning.
- 🔒 **Secure Data**: User-isolated storage and authentication using secure JWT sessions and PostgreSQL.
- 📄 **High-Quality PDF Export**: Optimized PDF generation using Puppeteer-core and Sparticuz Chromium for serverless deployment.

<br/>

## 🛠️ Tech Stack

| Frontend | Backend | Database & Infrastructure |
| :--- | :--- | :--- |
| **React** (UI) | **Node.js** & **Express** | **PostgreSQL** |
| **Vite** (Build Tool) | **Google Gemini AI** (Parsing) | **Vercel** (Hosting) |
| **Tailwind CSS** (Styling) | **Puppeteer Core** (PDF Export) | **JWT** (Auth) |
| **Framer Motion** (Animation) | **Multer** (File Uploads) | **GitHub** (Version Control)|

<br/>

## 📦 Local Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheSagarV/ATS-AI-RESUME.git
   cd ATS-AI-RESUME
   ```

2. **Install Dependencies**
   ```bash
   # Install Backend Dependencies
   npm install --prefix backend
   
   # Install Frontend Dependencies
   npm install --prefix ats-ai-frontend
   ```

3. **Environment Configuration**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   # Database
   PGHOST=your_host
   PGUSER=your_user
   PGPASSWORD=your_password
   PGDATABASE=your_db
   PGPORT=5432

   # API & Auth
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the Application**
   ```bash
   # Start the backend server (runs on port 5000)
   npm run dev --prefix backend

   # Start the frontend app (runs on port 5173)
   npm run dev --prefix ats-ai-frontend
   ```

<br/>

## 🌐 Vercel Deployment

This repository is optimized for a single-click deployment to Vercel as a Monorepo. 
Vercel automatically detects the root `package.json` and `vercel.json` to handle the routing and serverless function packaging.

<br/>

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/TheSagarV/ATS-AI-RESUME/issues).

<br/>

<div align="center">
Made with ❤️ by <a href="https://github.com/TheSagarV">Sagar Verma</a>
</div>
