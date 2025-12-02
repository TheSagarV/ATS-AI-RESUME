// src/templates/templatesRegistry.js

import ResumeTemplateClassic from "../components/templates/ResumeTemplateClassic.jsx";
import ResumeTemplateModern from "../components/templates/ResumeTemplateModern.jsx";
import ResumeTemplateMinimal from "../components/templates/ResumeTemplateMinimal.jsx";
import CleanResumeTemplate from "../components/templates/CleanResumeTemplate.jsx";
import TemplateDenseUX from "../components/templates/TemplateDenseUX.jsx";
import TemplateModernSplit from "../components/templates/TemplateModernSplit.jsx";
import TemplateRoundedSections from "../components/templates/TemplateRoundedSections.jsx";
import TemplateSoftSidebar from "../components/templates/TemplateSoftSidebar.jsx";
import TemplateCleanSingle from "../components/templates/TemplateCleanSingle.jsx";

export const TEMPLATE_LIST = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Timeless and elegant. Perfect for corporate roles, law, and finance.",
    Component: ResumeTemplateClassic,
    image: "/templates/classic.png"
  },
  {
    id: "modern",
    name: "Modern Sidebar",
    description: "Sleek two-column layout. Ideal for tech, design, and startups.",
    Component: ResumeTemplateModern,
    image: "/templates/modern.png"
  },
  {
    id: "minimal",
    name: "Minimalist Clean",
    description: "Simple and whitespace-heavy. Great for creative and academic roles.",
    Component: ResumeTemplateMinimal,
    image: "/templates/minimal.png"
  },
  {
    id: "clean-resume",
    name: "Clean Resume",
    description: "Simple and ATS-perfect layout",
    Component: CleanResumeTemplate,
    image: "/templates/clean-resume.png"
  },
  {
    id: "dense-ux",
    name: "Dense UX",
    description: "Compact layout with sharp skill grouping",
    Component: TemplateDenseUX,
    image: "/templates/dense-ux.png"
  },
  {
    id: "modern-split",
    name: "Modern Split",
    description: "Modern with sidebar — perfect for tech resumes",
    Component: TemplateModernSplit,
  },
  {
    id: "rounded-sections",
    name: "Rounded Sections",
    description: "Smooth rounded UI sections, very visually appealing",
    Component: TemplateRoundedSections,
  },
  {
    id: "soft-sidebar",
    name: "Soft Sidebar",
    description: "Soft and bright sidebar, minimal distraction",
    Component: TemplateSoftSidebar,
  },
  {
    id: "clean-single",
    name: "Clean Single Column",
    description: "Basic single-column professional design",
    Component: TemplateCleanSingle,
  },
];

export function getTemplateById(id) {
  return TEMPLATE_LIST.find((tpl) => tpl.id === id);
}
