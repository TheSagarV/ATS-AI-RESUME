import { getGeminiModel } from "./geminiClient.js";
import { extractTextFromFile } from "./fileExtract.js";
import { EXTRACTION_PROMPT } from "../prompts/resumePrompts.js";

export async function parseResumeWithAI(buffer, filename, jobDescription = "") {
  const raw = await extractTextFromFile(buffer, filename);
  if (!raw || raw.length < 20) return { raw, structured: {} };

  const model = getGeminiModel();
  const prompt = EXTRACTION_PROMPT(raw.slice(0, 8000));

  try {
    const result = await model.generateContent(prompt);
    const output = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(output);

    // Validate and clean the parsed data
    const structured = {
      fullName: parsed.fullName || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      location: parsed.location || "",
      summary: parsed.summary || "",
      skills: parsed.skills || [],
      experience: parsed.experience || [],
      education: parsed.education || [],
      certifications: parsed.certifications || [],
      projects: parsed.projects || [],
      languages: parsed.languages || []
    };

    return { raw, structured };

  } catch (err) {
    console.error("AI parsing failed:", err.message);
    return { raw, structured: {} };
  }
}
