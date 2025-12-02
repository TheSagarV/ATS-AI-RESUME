import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extract text from uploaded resume file.
 * Supports: PDF, DOCX, TXT
 *
 * @param {Buffer} buffer
 * @param {String} filename
 * @returns {String} extracted text
 */
export async function extractTextFromFile(buffer, filename) {
  if (!buffer) throw new Error("Missing file buffer");
  const ext = (filename.split(".").pop() || "").toLowerCase();

  try {
    if (ext === "pdf") {
      const data = await pdfParse(buffer);
      // if text is very short, return extracted raw (still likely fine)
      return cleanFormatting(data.text || "");
    }

    if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      return cleanFormatting(result.value || "");
    }

    if (ext === "txt") {
      return cleanFormatting(buffer.toString("utf-8"));
    }

    return "";
  } catch (err) {
    console.error("Extractor error:", err);
    return "";
  }
}

function cleanFormatting(str = "") {
  return str
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[•●▪◦]/g, "•")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}
