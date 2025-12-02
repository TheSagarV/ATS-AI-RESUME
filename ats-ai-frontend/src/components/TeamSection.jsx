import React from "react";

const TeamSection = () => {
  const members = [
    { name: "Sagar Verma", role: "Fullstack & AI Integration" },
    { name: "Member Two", role: "UI/UX & Templates" },
    { name: "Member Three", role: "Backend & Infrastructure" }
  ];

  return (
    <section id="team" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
          Project Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {members.map((m) => (
            <div
              key={m.name}
              className="card card-hover scale-card rounded-2xl border px-4 py-5 text-center shadow-md"
            >
              <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gradient-to-br from-cyan-300 to-purple-500 flex items-center justify-center text-xs font-bold text-slate-900">
                {m.name[0]}
              </div>
              <p className="text-sm font-semibold">{m.name}</p>
              <p className="mt-1 text-xs text-slate-400">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
