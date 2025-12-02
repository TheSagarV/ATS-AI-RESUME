import puppeteer from "puppeteer";
import {
  getClassicTemplate,
  getModernTemplate,
  getMinimalTemplate,
  getCleanResumeTemplate,
  getDenseUXTemplate,
  getModernSplitTemplate,
  getRoundedSectionsTemplate,
  getSoftSidebarTemplate,
  getCleanSingleTemplate
} from "./htmlTemplates.js";

export async function renderResumePdf(resume) {
  // resume: { title, data, template_id, ... }
  const rawData = resume.data || resume.data_json || {};
  const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
  const templateId = resume.template_id || "classic";

  let htmlContent = "";

  // Select template
  switch (templateId) {
    case "modern":
      htmlContent = getModernTemplate(data);
      break;
    case "minimal":
      htmlContent = getMinimalTemplate(data);
      break;
    case "clean-resume":
      htmlContent = getCleanResumeTemplate(data);
      break;
    case "dense-ux":
      htmlContent = getDenseUXTemplate(data);
      break;
    case "modern-split":
      htmlContent = getModernSplitTemplate(data);
      break;
    case "rounded-sections":
      htmlContent = getRoundedSectionsTemplate(data);
      break;
    case "soft-sidebar":
      htmlContent = getSoftSidebarTemplate(data);
      break;
    case "clean-single":
      htmlContent = getCleanSingleTemplate(data);
      break;
    case "classic":
    default:
      htmlContent = getClassicTemplate(data);
      break;
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      }
    });

    await browser.close();
    console.log("PDF Generated Successfully, size:", pdfBuffer.length);
    return pdfBuffer;
  } catch (error) {
    console.error("Puppeteer PDF Generation Error:", error);
    throw error;
  }
}
