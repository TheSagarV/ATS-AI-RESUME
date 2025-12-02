// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import TeamSection from "../components/TeamSection.jsx";
import Footer from "../components/Footer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const nav = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsImageLoaded(true);
    }
    // Fallback timeout in case onLoad doesn't fire
    const timer = setTimeout(() => setIsImageLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Optimization",
      desc: "Our advanced AI analyzes your resume and suggests improvements to grammar, tone, and impact."
    },
    {
      icon: "🎯",
      title: "ATS-Friendly Formatting",
      desc: "Beat the bots with templates designed to pass Applicant Tracking Systems with high scores."
    },
    {
      icon: "🎨",
      title: "Premium Templates",
      desc: "Choose from a variety of professional, modern, and creative designs that stand out."
    },
    {
      icon: "⚡",
      title: "Real-Time Preview",
      desc: "See your changes instantly as you edit. No more guessing how your resume will look."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Upload or Start Fresh",
      desc: "Upload your existing PDF/DOCX resume or start from scratch with our easy builder."
    },
    {
      num: "02",
      title: "Optimize with AI",
      desc: "Let our AI polish your bullet points and tailor your resume for your dream job."
    },
    {
      num: "03",
      title: "Download & Apply",
      desc: "Export as a polished PDF and start applying with confidence."
    }
  ];

  const testimonials = [
    {
      name: "Sarah J.",
      role: "Software Engineer",
      text: "I was getting no callbacks until I used this builder. The ATS check feature is a game changer!"
    },
    {
      name: "Michael T.",
      role: "Marketing Manager",
      text: "The templates are beautiful and professional. I landed my dream job in 2 weeks."
    },
    {
      name: "Emily R.",
      role: "Recent Graduate",
      text: "Super easy to use. The AI helped me write a summary that actually sounds like me."
    }
  ];

  const faqs = [
    {
      q: "Is this resume builder free?",
      a: "Yes, you can build and download your resume for free. We also offer premium features for advanced AI analysis."
    },
    {
      q: "Will my resume pass ATS?",
      a: "Absolutely. All our templates are rigorously tested against popular ATS software to ensure high readability."
    },
    {
      q: "Can I import my LinkedIn profile?",
      a: "Currently, we support importing from PDF and DOCX files. LinkedIn import is coming soon!"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="page-bg pt-28 pb-16 overflow-x-hidden">

        {/* HERO SECTION */}
        <section className="section section-narrow text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 text-cyan-600 text-sm font-medium mb-6 border border-cyan-500/20">
              ✨ AI + ATS + Clean Design
            </span>
            <h1 className="hero-heading mb-6">
              Build a <span className="text-cyan-600">Job-Winning</span> Resume <br className="hidden md:block" /> in Minutes, Not Hours.
            </h1>
            <p className="hero-subtitle max-w-2xl mx-auto mb-8">
              Stop struggling with formatting. Upload your old resume, let AI restructure it for ATS success, and download a polished, recruiter-ready PDF.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <button onClick={() => nav("/resume")} className="btn-primary px-8 py-3 text-lg shadow-lg shadow-cyan-500/20">
                Build My Resume
              </button>
              <button onClick={() => nav("/templates")} className="btn-secondary px-8 py-3 text-lg">
                View Templates
              </button>
            </div>
          </motion.div>

          {/* HERO IMAGE PLACEHOLDER */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-5xl mx-auto mt-12"
          >
            <div className="aspect-video bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden relative group">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
                  <div className="text-slate-300">
                    <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
              )}
              <img
                ref={imgRef}
                src="/app-preview.webp"
                alt="ATS Resume Builder Interface"
                className={`w-full h-full object-cover object-top transition-opacity duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl -z-10 rounded-[50%] opacity-50"></div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 bg-[var(--bg-soft)]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--text-main)] mb-4">Why Choose Us?</h2>
              <p className="text-[var(--text-soft)] max-w-2xl mx-auto">
                We combine cutting-edge AI technology with professional design principles to give you the unfair advantage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[var(--bg-elevated)] p-6 rounded-xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--text-soft)]">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--text-main)] mb-4">How It Works</h2>
              <p className="text-[var(--text-soft)]">Three simple steps to your new resume.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 -z-10"></div>

              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center relative bg-[var(--bg-page)]"
                >
                  <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-cyan-50 flex items-center justify-center mb-6 shadow-sm relative z-10">
                    <span className="text-3xl font-bold text-cyan-600">{s.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">{s.title}</h3>
                  <p className="text-[var(--text-soft)] px-4">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEMPLATE SHOWCASE (Existing but enhanced) */}
        <section className="py-20 bg-[var(--bg-soft)]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-[var(--text-main)] mb-2">ATS-Ready Templates</h2>
                <p className="text-[var(--text-soft)]">Professionally designed to get you hired.</p>
              </div>
              <button onClick={() => nav("/templates")} className="mt-4 md:mt-0 text-cyan-600 font-medium hover:underline">
                View All Templates →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group cursor-pointer" onClick={() => nav("/templates")}>
                <div className="aspect-[3/4] bg-white rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden relative mb-4 group-hover:shadow-lg transition-all">
                  <img
                    src="/templates/classic.png"
                    alt="Classic Resume Template"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                </div>
                <h3 className="font-semibold text-[var(--text-main)]">Classic Professional</h3>
                <p className="text-sm text-[var(--text-soft)]">Timeless and elegant.</p>
              </div>
              <div className="group cursor-pointer" onClick={() => nav("/templates")}>
                <div className="aspect-[3/4] bg-white rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden relative mb-4 group-hover:shadow-lg transition-all">
                  <img
                    src="/templates/modern.png"
                    alt="Modern Resume Template"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                </div>
                <h3 className="font-semibold text-[var(--text-main)]">Modern Sidebar</h3>
                <p className="text-sm text-[var(--text-soft)]">Sleek and tech-focused.</p>
              </div>
              <div className="group cursor-pointer" onClick={() => nav("/templates")}>
                <div className="aspect-[3/4] bg-white rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden relative mb-4 group-hover:shadow-lg transition-all">
                  <img
                    src="/templates/minimal.png"
                    alt="Minimal Resume Template"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                </div>
                <h3 className="font-semibold text-[var(--text-main)]">Minimalist Clean</h3>
                <p className="text-sm text-[var(--text-soft)]">Whitespace-heavy and sharp.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-[var(--text-main)] mb-12">Loved by Job Seekers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-[var(--bg-elevated)] p-6 rounded-xl border border-[var(--border-subtle)] shadow-sm text-left">
                  <div className="text-yellow-400 text-lg mb-4">⭐⭐⭐⭐⭐</div>
                  <p className="text-[var(--text-main)] mb-6 text-sm italic">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-sm text-[var(--text-main)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-soft)]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-[var(--bg-soft)]">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[var(--text-main)] mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] p-6">
                  <h3 className="font-semibold text-[var(--text-main)] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[var(--text-soft)]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to land your dream job?</h2>
              <p className="text-cyan-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have upgraded their careers with our AI resume builder.
              </p>
              <button onClick={() => nav("/resume")} className="bg-white text-cyan-600 font-bold py-3 px-8 rounded-lg hover:bg-cyan-50 transition-colors shadow-lg">
                Create My Resume Now
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          </div>
        </section>

        <TeamSection />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
