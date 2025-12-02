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

const ResumeTemplateClassic = ({ data }) => {
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

      {/* Name */}
      <h1 className="text-2xl font-semibold mb-1">
        {fullName || "Your Name"}
      </h1>

      {/* Contact Info */}
      <p className="text-[11px] mb-4 text-slate-600">
        {[email, phone, location].filter(Boolean).join(" • ") ||
          "Contact info here"}
      </p>

      {/* SUMMARY */}
      <h2 className="font-semibold text-[13px] mb-1">Summary</h2>
      <p className="mb-3 text-[12px]">
        {summary ||
          "Add a short professional summary tailored to your target job."}
      </p>

      {/* SKILLS */}
      <h2 className="font-semibold text-[13px] mb-1">Skills</h2>
      <ul className="mb-3 text-[12px] list-disc ml-4">
        {skillsArr.length > 0
          ? skillsArr.map((skill, i) => <li key={i}>{skill}</li>)
          : <li>List your key skills.</li>}
      </ul>

      {/* EXPERIENCE */}
      <h2 className="font-semibold text-[13px] mb-1">Experience</h2>
      <ul className="mb-3 text-[12px] list-disc ml-4">
        {expArr.length > 0
          ? expArr.map((item, i) => <li key={i}>{item}</li>)
          : <li>Add your most relevant roles and achievements.</li>}
      </ul>

      {/* EDUCATION */}
      <h2 className="font-semibold text-[13px] mb-1">Education</h2>
      <ul className="text-[12px] list-disc ml-4">
        {eduArr.length > 0
          ? eduArr.map((item, i) => <li key={i}>{item}</li>)
          : <li>Add your degrees, institutions and years.</li>}
      </ul>
    </div>
  );
};

export default ResumeTemplateClassic;
