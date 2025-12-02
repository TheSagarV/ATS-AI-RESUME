// src/components/templates/TemplateDenseUX.jsx
import React from "react";

const TemplateDenseUX = ({ data }) => {
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
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
        <p className="text-xs text-slate-600 mt-1">{title}</p>
        <p className="text-[11px] text-slate-500 mt-1 space-x-2">
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {location && <span>• {location}</span>}
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {/* Left column */}
        <div className="col-span-1 space-y-3">
          {summary && (
            <section>
              <h2 className="font-semibold text-[11px] tracking-[0.16em] uppercase mb-1">
                Profile
              </h2>
              <p className="text-[11px] text-slate-700 whitespace-pre-line">
                {summary}
              </p>
            </section>
          )}

          {skillList.length > 0 && (
            <section>
              <h2 className="font-semibold text-[11px] tracking-[0.16em] uppercase mb-1">
                Skills
              </h2>
              <ul className="text-[11px] text-slate-700 grid grid-cols-1 gap-0.5">
                {skillList.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
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

        {/* Right column */}
        <div className="col-span-2">
          {experience && (
            <section>
              <h2 className="font-semibold text-[11px] tracking-[0.16em] uppercase mb-1">
                Work Experience
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

export default TemplateDenseUX;
