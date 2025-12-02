// Enhanced AI prompts for resume extraction and optimization

export const EXTRACTION_PROMPT = (resumeText) => `
You are an expert resume parser. Extract ALL information from the following resume into a structured JSON format.

CRITICAL INSTRUCTIONS:
1. Extract EVERY detail mentioned in the resume
2. For experience and education, create detailed objects with ALL available information
3. If a field is not present, use null (not empty string)
4. Preserve exact wording from the resume
5. Return ONLY valid JSON, no markdown formatting

REQUIRED JSON STRUCTURE:
{
  "fullName": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "location": "string or null (city, state, or country)",
  "summary": "string or null (professional summary/objective)",
  "skills": ["array", "of", "skills"] or null,
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "Month Year or null",
      "endDate": "Month Year or 'Present' or null",
      "description": "Detailed description of responsibilities and achievements"
    }
  ] or null,
  "education": [
    {
      "degree": "Degree name (e.g., Bachelor of Science in Computer Science)",
      "institution": "University/School name",
      "location": "City, State or null",
      "gpa": "GPA or percentage or null",
      "startDate": "Year or null",
      "endDate": "Year or 'Present' or null",
      "achievements": "Honors, awards, relevant coursework, etc. or null"
    }
  ] or null,
  "certifications": ["array of certifications"] or null,
  "projects": ["array of notable projects"] or null,
  "languages": ["array of languages"] or null
}

RESUME TEXT:
${resumeText}

Return the JSON now:`;

export const OPTIMIZATION_PROMPT = (resumeText, jobDescription) => `
You are an expert ATS (Applicant Tracking System) resume optimizer with deep knowledge of:
- ATS systems like Taleo, Workday, Greenhouse, Lever
- Resume keyword optimization
- Action verb usage and impact quantification
- Industry-specific terminology

TASK: Optimize the following resume for ATS compatibility and relevance to the job description.

JOB DESCRIPTION:
${jobDescription || "General professional role - optimize for broad ATS compatibility"}

CURRENT RESUME:
${resumeText}

OPTIMIZATION RULES:
1. Use strong action verbs (achieved, implemented, led, developed, etc.)
2. Quantify achievements with numbers, percentages, or metrics wherever possible
3. Match keywords from the job description naturally
4. Ensure proper formatting (no tables, graphics, or complex formatting)
5. Use standard section headings (Experience, Education, Skills)
6. Include relevant technical skills and tools
7. Remove weak phrases like "responsible for" or "duties included"
8. Emphasize accomplishments over responsibilities

REQUIRED JSON OUTPUT:
{
  "fullName": "string",
  "email": "string or null",
  "phone": "string or null", 
  "location": "string or null",
  "summary": "ATS-optimized professional summary with keywords from job description",
  "skills": ["optimized", "skill", "list", "matching", "job", "keywords"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "startDate": "Month Year or null",
      "endDate": "Month Year or 'Present' or null",
      "description": "Enhanced bullet points with action verbs, quantified results, and relevant keywords"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "Institution name",
      "gpa": "GPA if strong (>3.5) or null",
      "startDate": "Year or null",
      "endDate": "Year or null"
    }
  ],
  "atsScore": 85,
  "matchedKeywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": [
    "Specific suggestion 1 based on analysis",
    "Specific suggestion 2 based on analysis",
    "Specific suggestion 3 based on analysis"
  ],
  "improvements": {
    "strengthsAdded": ["What was improved in this version"],
    "weaknessesRemoved": ["What weak elements were removed"]
  }
}

ATS SCORE CALCULATION (0-100):
- Keyword match with job description: 40 points
- Action verbs and quantification: 25 points
- Proper formatting and structure: 20 points
- Skills relevance: 15 points

Return the optimized resume JSON now:`;

export const KEYWORD_EXTRACTION_PROMPT = (jobDescription) => `
Extract the most important keywords, skills, and requirements from this job description.
Focus on: technical skills, soft skills, tools, certifications, experience requirements.

JOB DESCRIPTION:
${jobDescription}

Return JSON array of keywords:
{
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"],
  "requirements": ["requirement1", "requirement2"]
}`;
