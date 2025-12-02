// src/components/templates/TemplateSoftSidebar.jsx
import React from "react";

const TemplateSoftSidebar = ({ data }) => {
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
      <div className="grid grid-cols-[32%_1fr] gap-4">
        {/* Sidebar */}
        <aside className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-4 space-y-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-0.5">
              {fullName}
            </h1>
            <p className="text-[11px] text-slate-600">{title}</p>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
              Contact
            </h2>
            <p className="text-[11px] text-slate-700 space-y-0.5">
              {email && <span className="block">{email}</span>}
              {phone && <span className="block">{phone}</span>}
              {location && <span className="block">{location}</span>}
            </p>
          </div>

          {skillList.length > 0 && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
                Skills
              </h2>
              <ul className="text-[11px] text-slate-700 space-y-0.5">
                {skillList.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="space-y-3">
          {summary && (
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
                Summary
              </h2>
              <p className="text-[11px] text-slate-700 whitespace-pre-line">
                {summary}
              </p>
            </section>
          )}

          {experience && (
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
                Experience
              </h2>
              <p className="text-[11px] text-slate-700 whitespace-pre-line">
                {experience}
              </p>
            </section>
          )}

          {education && (
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
                Education
              </h2>
              <p className="text-[11px] text-slate-700 whitespace-pre-line">
                {education}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default TemplateSoftSidebar;
