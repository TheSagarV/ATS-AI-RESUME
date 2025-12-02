// src/components/TemplateCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const TemplateCard = ({ id, name, role, vibe, bestFor }) => {
  return (
    <div className="card flex flex-col justify-between bg-navy-900/80">
      <div>
        <h2 className="text-sm font-semibold mb-1">{name}</h2>
        <p className="text-[11px] text-slate-400 mb-1">{role}</p>
        <p className="text-[11px] text-slate-300 mb-2">{vibe}</p>
        <p className="text-[11px] text-slate-400">
          <span className="font-semibold">Best for:</span> {bestFor}
        </p>
      </div>
      <Link
        to={`/templates/${id}`}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-4 py-1.5 text-[11px] font-semibold text-navy-900 hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        Customize this template
      </Link>
    </div>
  );
};

export default TemplateCard;
