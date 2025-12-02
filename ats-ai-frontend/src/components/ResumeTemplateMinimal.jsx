import React from "react";

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string")
    return value
      .split(/[,;\n]+/)
      .map((v) => v.trim())
      .filter(Boolean);
  return [];
};

const ResumeTemplateMinimal = ({ data }) => {
  const {
    fullName,
    email,
    phone,
    location,
    summary,
    skills,
    experience,
    education,
  } = data;

  const skillsArr = toArray(skills);
  const expArr = toArray(experience);
  const eduArr = toArray(education);

  return (
    <div className="text-slate-900 text-xs md:text-sm leading-relaxed">

      {/* HEADER */}
      <header className="border-b border-slate-300 pb-2 mb-3">
        <h1 className="text-xl font-semibold tracking-wide">
          {fullName || "Your Name"}
        </h1>
        <p className="text-[11px] text-slate-500">
          {[email, phone, location].filter(Boolean).join(" • ") ||
            "Contact info"}
        </p>
      </header>

      {/* SUMMARY */}
      <section className="mb-3">
        <h2 className="font-semibold text-[13px] mb-1 uppercase tracking-wide">
          Summary
        </h2>
        <p className="text-[12px]">
          {summary ||
            "Concise summary emphasising role, years of experience and strengths."}
        </p>
      </section>

      {/* SKILLS */}
      <section className="mb-3">
        <h2 className="font-semibold text-[13px] mb-1 uppercase tracking-wide">
          Skills
        </h2>

        <ul className="text-[12px] list-disc ml-4">
          {skillsArr.length > 0
            ? skillsArr.map((skill, i) => <li key={i}>{skill}</li>)
            : <li>Key technical & soft skills.</li>}
        </ul>
      </section>

      {/* EXPERIENCE */}
      <section className="mb-3">
        <h2 className="font-semibold text-[13px] mb-1 uppercase tracking-wide">
          Experience
        </h2>

        <ul className="text-[12px] list-disc ml-4 whitespace-pre-line">
          {expArr.length > 0
            ? expArr.map((item, i) => <li key={i}>{item}</li>)
            : <li>Roles, achievements, and impact.</li>}
        </ul>
      </section>

      {/* EDUCATION */}
      <section>
        <h2 className="font-semibold text-[13px] mb-1 uppercase tracking-wide">
          Education
        </h2>

        <ul className="text-[12px] list-disc ml-4 whitespace-pre-line">
          {eduArr.length > 0
            ? eduArr.map((item, i) => <li key={i}>{item}</li>)
            : <li>Degrees and certifications.</li>}
        </ul>
      </section>
    </div>
  );
};

export default ResumeTemplateMinimal;
