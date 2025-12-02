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

const ResumeTemplateModern = ({ data }) => {
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
    <div className="grid grid-cols-3 gap-4 text-xs md:text-sm text-slate-900">

      {/* LEFT SIDEBAR */}
      <aside className="col-span-1 bg-slate-100 px-3 py-4 rounded-lg">

        {/* NAME */}
        <h1 className="text-lg font-semibold mb-1">
          {fullName || "Your Name"}
        </h1>

        {/* CONTACT */}
        <p className="text-[11px] text-slate-600 mb-4">
          {[email, phone, location].filter(Boolean).join(" • ") ||
            "Contact info"}
        </p>

        {/* SKILLS */}
        <h2 className="font-semibold text-[13px] mb-1">Skills</h2>
        <ul className="text-[12px] list-disc ml-4 whitespace-pre-line">
          {skillsArr.length > 0
            ? skillsArr.map((skill, i) => <li key={i}>{skill}</li>)
            : <li>List your key skills here</li>}
        </ul>

      </aside>

      {/* MAIN CONTENT */}
      <main className="col-span-2">

        {/* SUMMARY */}
        <h2 className="font-semibold text-[13px] mb-1">Summary</h2>
        <p className="mb-3 text-[12px]">
          {summary ||
            "Short summary focusing on impact, tools, and domain strengths."}
        </p>

        {/* EXPERIENCE */}
        <h2 className="font-semibold text-[13px] mb-1">Experience</h2>
        <ul className="mb-3 text-[12px] list-disc ml-4 whitespace-pre-line">
          {expArr.length > 0
            ? expArr.map((item, i) => <li key={i}>{item}</li>)
            : <li>Describe your roles with bullet-point achievements.</li>}
        </ul>

        {/* EDUCATION */}
        <h2 className="font-semibold text-[13px] mb-1">Education</h2>
        <ul className="text-[12px] list-disc ml-4 whitespace-pre-line">
          {eduArr.length > 0
            ? eduArr.map((item, i) => <li key={i}>{item}</li>)
            : <li>Universities, degrees, and graduation years.</li>}
        </ul>

      </main>
    </div>
  );
};

export default ResumeTemplateModern;
