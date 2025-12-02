// src/components/templates/TemplateCleanSingle.jsx
import React from "react";

const TemplateCleanSingle = ({ data }) => {
  const {
    fullName,
    title,
    summary,
    skills,
    experience,
    education,
    phone,
    email,
    location,
    website,
  } = data;

  return (
    <div className="w-full bg-white text-slate-900 p-8 text-xs leading-relaxed border border-violet-200">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-wide">
          {fullName || "YOUR NAME"}
        </h1>
        <p className="text-sm tracking-wide uppercase">
          {title || "Systems Designer"}
        </p>
      </header>

      <Section title="Professional Summary">
        <p className="whitespace-pre-line">
          {summary ||
            "Summarize your professional profile, years of experience, and key focus areas."}
        </p>
      </Section>

      <Section title="Contact">
        <div className="flex justify-between text-[11px]">
          <div>
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
          </div>
          <div className="text-right">
            {location && <p>{location}</p>}
            {website && <p>{website}</p>}
          </div>
        </div>
      </Section>

      <Section title="Work Experience">
        <p className="whitespace-pre-line">
          {experience ||
            "Describe your roles and achievements with concise bullet-style paragraphs."}
        </p>
      </Section>

      <Section title="Education">
        <p className="whitespace-pre-line">
          {education || "Degree, university, years, and highlights."}
        </p>
      </Section>

      <Section title="Skills & Certifications">
        <p className="whitespace-pre-line">
          {Array.isArray(skills) ? skills.join(", ") : (skills || "Technical skills, tools, certifications, and frameworks.")}
        </p>
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section className="mb-4">
    <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
      {title}
    </h2>
    {children}
  </section>
);

export default TemplateCleanSingle;
