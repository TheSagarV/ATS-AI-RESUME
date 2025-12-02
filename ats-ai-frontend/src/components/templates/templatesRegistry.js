// src/templates/templatesRegistry.js
import CleanResumeTemplate from "../components/templates/CleanResumeTemplate.jsx";
import TemplateDenseUX from "../components/templates/TemplateDenseUX.jsx";
import TemplateModernSplit from "../components/templates/TemplateModernSplit.jsx";
import TemplateRoundedSections from "../components/templates/TemplateRoundedSections.jsx";
import TemplateSoftSidebar from "../components/templates/TemplateSoftSidebar.jsx";

// Each template gets an id (used in URL), a label, short description, and its React component
export const TEMPLATE_LIST = [
  {
    id: "clean-single",
    name: "Clean Single Column",
    description: "Simple, ATS-friendly single-column resume with strong typography.",
    Component: CleanResumeTemplate,
  },
  {
    id: "dense-ux",
    name: "Dense UX Layout",
    description: "Two-column layout, great for UX / product roles with lots of detail.",
    Component: TemplateDenseUX,
  },
  {
    id: "modern-split",
    name: "Modern Split",
    description: "Bold header with split content, ideal for modern tech resumes.",
    Component: TemplateModernSplit,
  },
  {
    id: "rounded-sections",
    name: "Rounded Sections",
    description: "Soft rounded section cards, very readable and clean.",
    Component: TemplateRoundedSections,
  },
  {
    id: "soft-sidebar",
    name: "Soft Sidebar",
    description: "Left sidebar for contact & skills, main content on the right.",
    Component: TemplateSoftSidebar,
  },
];

export const getTemplateById = (id) =>
  TEMPLATE_LIST.find((t) => t.id === id) || TEMPLATE_LIST[0];
