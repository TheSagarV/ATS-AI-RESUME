// src/components/templates/TemplateModernSplit.jsx
import React from "react";

const TemplateModernSplit = ({ data }) => {
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
    <div className="text-slate-900 text-[12px] leading-relaxed font-[system-ui] p-8 break-words">
      <header className="mb-4 flex items-end justify-between border-b border-slate-300 pb-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
          <p className="text-xs text-slate-600 mt-1">{title}</p>
        </div>
        <div className="text-[11px] text-right text-slate-600">
          {email && <p>{email}</p>}
          {phone && <p>{phone}</p>}
          {location && <p>{location}</p>}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {summary && (
            <section>
              <h2 className="font-semibold text-[11px] tracking-[0.16em] uppercase mb-1">
                Summary
              </h2>
              <p className="text-[11px] text-slate-700 whitespace-pre-line">
                {summary}
              </p>
            </section>
          )}

          {education && (
            <section>
              <h2 className="font-semibold text-[11px] tracking-[0.16em] uppercase mb-1">
                Education
              </h2>
              <p className="text-[11px] text-slate-700 whitespace-pre-line">
                {education}
              </p>
            </section>
          )}
        </div>

        <div className="space-y-3">
          {skillList.length > 0 && (
            <section>
              <h2 className="font-semibold text-[11px] tracking-[0.16em] uppercase mb-1">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-[2px] rounded-full bg-slate-100 border border-slate-300 text-[11px]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {experience && (
            <section>
              <h2 className="font-semibold text-[11px] tracking-[0.16em] uppercase mb-1">
                Experience
              </h2>
              <p className="text-[11px] text-slate-700 whitespace-pre-line">
                {experience}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModernSplit;
