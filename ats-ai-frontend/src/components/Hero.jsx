// src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="pt-28 pb-20 px-4 flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-accent-cyan/80 mb-3">
          AI + ATS + Clean Design
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-accent-cyan via-sky-400 to-accent-purple bg-clip-text text-transparent">
          Turn any resume into an ATS-friendly, job-ready version in seconds.
        </h1>
        <p className="mt-4 text-sm md:text-base text-slate-300">
          Upload your old resume (PDF or DOCX), let AI restructure it with
          ATS-safe formatting, and download beautiful, recruiter-ready templates.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link
          to="/resume"
          className="rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-6 py-2.5 text-xs md:text-sm font-semibold text-navy-900 shadow-lg shadow-accent-cyan/30 hover:scale-[1.03] active:scale-[0.98] transition-transform"
        >
          Open Resume Builder
        </Link>
        <Link
          to="/templates"
          className="rounded-full border border-slate-500/70 px-5 py-2 text-xs md:text-sm text-slate-200 hover:border-accent-cyan/80 hover:text-accent-cyan transition"
        >
          View Templates
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
