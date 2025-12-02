// src/pages/TemplatesPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { TEMPLATE_LIST } from "../templates/templatesRegistry.js";

const TemplatesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUseTemplate = (id) => {
    if (!user) {
      // simple popup instead of breaking layout
      alert("Please login first to customize a template.");
      return;
    }
    navigate(`/templates/${id}`);
  };

  return (
    <>
      <Navbar />
      <main className="page-bg min-h-screen pt-24 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-2">
              Choose a resume template
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Pick one of your custom layouts. On the next step you&apos;ll fill
              a form and see a live preview of the template, just like Canva.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATE_LIST.map((tpl) => (
              <button
                key={tpl.id}
                className="group text-left relative bg-slate-900/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300 hover:-translate-y-1"
                onClick={() => handleUseTemplate(tpl.id)}
              >
                {/* Image Container */}
                <div className="aspect-[1/1.414] w-full bg-slate-800 relative overflow-hidden">
                  {tpl.image ? (
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <span className="text-slate-600 font-bold text-4xl opacity-20">{tpl.name.charAt(0)}</span>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute top-3 right-3 bg-cyan-500/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm">
                    ATS FRIENDLY
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 relative">
                  <h2 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {tpl.name}
                  </h2>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    {tpl.description}
                  </p>

                  <span className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-slate-800 text-xs font-semibold text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                    Use This Template
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main >
    </>
  );
};

export default TemplatesPage;
