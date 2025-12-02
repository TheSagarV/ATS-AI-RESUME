export const buildOptimizePrompt = (resumeText, jobDescription = "") => `
You are an expert ATS resume optimizer.

Take this raw resume text and return a JSON object with this schema:

{
  "personal_info": { "name": "", "email": "", "phone": "", "location": "" },
  "summary": "",
  "experience": [
    { "role": "", "company": "", "location": "", "start_date": "", "end_date": "", "points": ["", ""] }
  ],
  "education": [
    { "degree": "", "institution": "", "location": "", "start_date": "", "end_date": "" }
  ],
  "skills": ["", ""],
  "projects": [
    { "name": "", "description": "", "tech_stack": ["", ""] }
  ],
  "certifications": ["", ""]
}

Rules:
- Use ATS-safe plain text
- No tables, images, or fancy characters
- Use measurable bullet points
- If information is missing, keep fields as empty strings or empty arrays

${
  jobDescription
    ? `Optimize to match this job description (keywords, phrasing):\n${jobDescription}\n`
    : ""
}

Raw resume:
${resumeText}

Return JSON only, no extra commentary.
`;
