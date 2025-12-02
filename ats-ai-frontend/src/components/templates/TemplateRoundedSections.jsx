// src/components/templates/TemplateRoundedSections.jsx
import React from "react";

const SectionCard = ({ title, children }) => (
  <section className="mb-2 last:mb-0">
    <h2 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-600 mb-1">
      {title}
    </h2>
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      {children}
    </div>
  </section>
);

const TemplateRoundedSections = ({ data }) => {
  const {
    fullName,
    title,
    email,
    phone,
    location,
    summary,
    skills,
    experience,
    education,
  } = data;

  const skillList = Array.isArray(skills)
    ? skills
    : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  return (
    <div className="text-slate-900 text-[12px] leading-relaxed font-[system-ui] p-8">
      <header className="mb-3">
        <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
        <p className="text-xs text-slate-600 mt-1">{title}</p>
        <p className="text-[11px] text-slate-500 mt-1 space-x-2">
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {location && <span>• {location}</span>}
        </p>
      </header>

      {summary && (
        <SectionCard title="Summary">
          <p className="text-[11px] text-slate-700 whitespace-pre-line">
            {summary}
          </p>
        </SectionCard>
      )}

      {skillList.length > 0 && (
        <SectionCard title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {skillList.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-white border border-slate-200 px-2 py-[2px] text-[11px]"
              >
                {s}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {experience && (
        <SectionCard title="Experience">
          <p className="text-[11px] text-slate-700 whitespace-pre-line">
            {experience}
          </p>
        </SectionCard>
      )}

      {education && (
        <SectionCard title="Education">
          <p className="text-[11px] text-slate-700 whitespace-pre-line">
            {education}
          </p>
        </SectionCard>
      )}
    </div>
  );
};

export default TemplateRoundedSections;
