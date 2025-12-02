// src/routes/resumeRoutes.js
import express from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../utils/multerConfig.js";
import { parseResumeWithAI } from "../utils/aiResumeParser.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { renderResumePdf } from "../utils/pdfRenderer.js";

export const resumeRouter = express.Router();

// ===============================
// UPLOAD (AI parse)
// ===============================
resumeRouter.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { buffer, originalname } = req.file;
    const { raw, structured } = await parseResumeWithAI(buffer, originalname, req.body?.jobDescription || "");

    return res.json({ raw, structured });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: "Failed to upload & parse resume" });
  }
});

// ===============================
// OPTIMIZE
// ===============================
resumeRouter.post("/optimize", authMiddleware, async (req, res) => {
  try {
    const { resumeText = "", jobDescription = "" } = req.body || {};

    if (!resumeText)
      return res.status(400).json({ error: "resumeText is required" });

    const safeResume = resumeText.substring(0, 8000);
    const safeJob = jobDescription.substring(0, 4000);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ---- FIXED: Correct model initialization ----
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Use enhanced optimization prompt
    const prompt = `You are an expert ATS (Applicant Tracking System) resume optimizer.

JOB DESCRIPTION:
${safeJob || "General professional role - optimize for broad ATS compatibility"}

CURRENT RESUME:
${safeResume}

OPTIMIZATION RULES:
1. Use strong action verbs (achieved, implemented, led, developed, etc.)
2. Quantify achievements with numbers, percentages, or metrics
3. Match keywords from the job description naturally
4. Use standard section headings
5. Remove weak phrases like "responsible for"

REQUIRED JSON OUTPUT:
{
  "fullName": "string",
  "email": "string or null",
  "phone": "string or null",
  "location": "string or null",
  "summary": "ATS-optimized professional summary with keywords",
  "skills": ["optimized", "skills", "matching", "job"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "startDate": "Month Year or null",
      "endDate": "Month Year or 'Present' or null",
      "description": "Enhanced bullet points with action verbs and quantified results"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "Institution name",
      "gpa": "GPA if >3.5 or null",
      "startDate": "Year or null",
      "endDate": "Year or null"
    }
  ],
  "atsScore": 85,
  "matchedKeywords": ["keyword1", "keyword2"],
  "suggestions": [
    "Specific suggestion based on analysis",
    "Another specific improvement"
  ]
}

ATS SCORE (0-100):
- Keyword match: 40 points
- Action verbs and quantification: 25 points
- Proper formatting: 20 points
- Skills relevance: 15 points

Return optimized resume JSON:`;

    let aiText = "";
    try {
      const result = await model.generateContent(prompt);
      aiText = result.response.text();
    } catch (err) {
      console.error("Gemini error:", err?.message || err);
      return res.status(500).json({ error: "AI generation failed" });
    }

    // Clean output of backticks
    const cleaned = aiText.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(cleaned);

      // Ensure ATS score and suggestions exist
      const atsScore = parsed.atsScore || 70;
      const matchedKeywords = parsed.matchedKeywords || [];
      const suggestions = parsed.suggestions && parsed.suggestions.length > 0
        ? parsed.suggestions
        : [
          "Add quantifiable metrics to your achievements",
          "Use stronger action verbs to begin bullet points",
          "Include more keywords from the job description"
        ];

      return res.json({
        improved: parsed,
        atsScore,
        matchedKeywords,
        suggestions
      });
    } catch (err) {
      console.warn("OPTIMIZE: AI returned non-JSON, fallback used.");
      return res.json({
        improved: { experience: safeResume },
        atsScore: 50,
        matchedKeywords: [],
        suggestions: ["AI parsing failed - please try again with a clearer resume format"]
      });
    }

  } catch (err) {
    console.error("OPTIMIZE ERROR:", err);
    res.status(500).json({ error: "AI optimization failed" });
  }
});

// ===============================
// SAVE RESUME
// ===============================
resumeRouter.post("/save", authMiddleware, async (req, res) => {
  try {
    const { title, templateId, data } = req.body || {};
    if (!title || !templateId || !data)
      return res.status(400).json({ error: "title, templateId and data are required" });

    const insert = await pool.query(
      `INSERT INTO resumes(user_id,title,template_id,data)
       VALUES ($1,$2,$3,$4)
       RETURNING id,title,template_id,data,created_at`,
      [req.user.id, title, templateId, JSON.stringify(data)]
    );

    res.json({ resume: insert.rows[0] });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ error: "Failed to save resume" });
  }
});

// ===============================
// LIST RESUMES (With fallback)
// ===============================
resumeRouter.get("/my", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, template_id, created_at
         FROM resumes
         WHERE user_id = $1
         ORDER BY created_at DESC`,
      [req.user.id]
    );
    return res.json({ resumes: result.rows });
  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load resumes" });
  }
});

// ===============================
// GET SINGLE RESUME (Full Data)
// ===============================
resumeRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const result = await pool.query(
      `SELECT * FROM resumes WHERE id=$1 AND user_id=$2`,
      [id, req.user.id]
    );

    if (!result.rows.length)
      return res.status(404).json({ error: "Resume not found" });

    return res.json({ resume: result.rows[0] });
  } catch (err) {
    console.error("GET RESUME ERROR:", err);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

// ===============================
// PDF DOWNLOAD
// ===============================
resumeRouter.get("/:id/pdf", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      `SELECT * FROM resumes WHERE id=$1 AND user_id=$2`,
      [id, req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Resume not found" });

    const resume = result.rows[0];

    const pdfBuffer = await renderResumePdf(resume);
    console.log("ROUTE: PDF Buffer size:", pdfBuffer.length);
    console.log("ROUTE: Is Buffer?", Buffer.isBuffer(pdfBuffer));

    const safeTitle = (resume.title || "resume").replace(/[^a-zA-Z0-9-_ ]/g, "").trim();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeTitle}.pdf"`
    );

    // Force binary send to avoid JSON serialization of Uint8Array
    res.end(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// ===============================
// DELETE RESUME
// ===============================
resumeRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Resume not found or unauthorized" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete resume" });
  }
});
