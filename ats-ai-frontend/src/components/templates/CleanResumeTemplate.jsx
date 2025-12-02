// src/components/templates/CleanResumeTemplate.jsx
import React from "react";

const CleanResumeTemplate = ({ data }) => {
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
    <div className="text-slate-900 text-[13px] leading-relaxed font-[system-ui] p-8">
      <header className="border-b border-slate-300 pb-3 mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
        {title && (
          <p className="text-sm text-slate-600 mt-1 uppercase tracking-[0.18em]">
            {title}
          </p>
        )}
        <p className="text-[11px] text-slate-500 mt-2 space-x-3">
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {location && <span>• {location}</span>}
        </p>
      </header>

      {summary && (
        <section className="mb-3">
          <h2 className="font-semibold text-[13px] tracking-[0.15em] text-slate-700 uppercase mb-1.5">
            Summary
          </h2>
          <p className="text-[12px] text-slate-700 whitespace-pre-line">
            {summary}
          </p>
        </section>
      )}

      {skillList.length > 0 && (
        <section className="mb-3">
          <h2 className="font-semibold text-[13px] tracking-[0.15em] text-slate-700 uppercase mb-1.5">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skillList.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-full border border-slate-300 px-2 py-[2px] text-[11px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {experience && (
        <section className="mb-3">
          <h2 className="font-semibold text-[13px] tracking-[0.15em] text-slate-700 uppercase mb-1.5">
            Experience
          </h2>
          <p className="text-[12px] text-slate-700 whitespace-pre-line">
            {experience}
          </p>
        </section>
      )}

      {education && (
        <section>
          <h2 className="font-semibold text-[13px] tracking-[0.15em] text-slate-700 uppercase mb-1.5">
            Education
          </h2>
          <p className="text-[12px] text-slate-700 whitespace-pre-line">
            {education}
          </p>
        </section>
      )}
    </div>
  );
};

export default CleanResumeTemplate;
