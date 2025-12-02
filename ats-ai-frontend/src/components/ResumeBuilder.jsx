import React, { useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, Reorder } from "framer-motion";

import ResumeTemplateClassic from "./templates/ResumeTemplateClassic.jsx";
import ResumeTemplateModern from "./templates/ResumeTemplateModern.jsx";
import ResumeTemplateMinimal from "./templates/ResumeTemplateMinimal.jsx";
import CleanResumeTemplate from "./templates/CleanResumeTemplate.jsx";
import TemplateDenseUX from "./templates/TemplateDenseUX.jsx";
import TemplateModernSplit from "./templates/TemplateModernSplit.jsx";
import TemplateRoundedSections from "./templates/TemplateRoundedSections.jsx";
import TemplateSoftSidebar from "./templates/TemplateSoftSidebar.jsx";
import TemplateCleanSingle from "./templates/TemplateCleanSingle.jsx";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  summary: "",
  skills: "",
  experience: "",
  education: "",
  customSections: [],
  sectionOrder: ["summary", "skills", "experience", "education"],
  design: {
    font: 'sans', // sans, serif, mono
    size: 'medium', // small, medium, large
    color: '#0f172a', // default slate-900
    textColor: '#334155' // default slate-700
  }
};

const ResumeBuilder = ({ defaultTemplateId = "classic" }) => {
  const { token, user, logout } = useAuth();

  // Load from localStorage if available
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem("resume_form_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure design object exists and merge safely
        return {
          ...initialForm,
          ...parsed,
          design: {
            ...initialForm.design,
            ...(parsed.design || {})
          }
        };
      }
    } catch (e) {
      console.error("Failed to parse saved resume data", e);
    }
    return initialForm;
  });

  // Save to localStorage whenever form changes
  React.useEffect(() => {
    localStorage.setItem("resume_form_data", JSON.stringify(form));
  }, [form]);

  // Load latest resume from server if local is default/empty
  React.useEffect(() => {
    const loadLatestResume = async () => {
      if (!token) return;

      // Check if current form is effectively empty/default
      const isDefault =
        !form.fullName &&
        !form.email &&
        (!form.experience || form.experience === initialForm.experience) &&
        (!form.education || form.education === initialForm.education);

      if (!isDefault) return;

      try {
        // 1. Get list of resumes
        const listRes = await api.get("/resume/my");
        const resumes = listRes.data.resumes || [];

        if (resumes.length > 0) {
          // 2. Get latest resume details
          const latestId = resumes[0].id;
          const detailRes = await api.get(`/resume/${latestId}`);
          const savedData = detailRes.data.resume.data;

          if (savedData) {
            console.log("Loaded latest resume from server:", latestId);
            setResumeId(latestId);
            setForm(prev => ({
              ...prev,
              ...savedData,
              design: {
                ...prev.design,
                ...(savedData.design || {})
              }
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load latest resume:", err);
      }
    };

    loadLatestResume();
  }, [token]); // Run when token is available

  const [jobDescription, setJobDescription] = useState("");

  // Initialize template from form.design.template if available, otherwise default
  const [template, setTemplate] = useState(() => {
    return form.design?.template || defaultTemplateId;
  });

  // Sync template state with form.design.template
  React.useEffect(() => {
    if (form.design?.template && form.design.template !== template) {
      setTemplate(form.design.template);
    }
  }, [form.design?.template]);

  // Ensure standard sections are always in sectionOrder (Auto-repair corrupted state)
  React.useEffect(() => {
    const standard = ["summary", "skills", "experience", "education"];
    const current = form.sectionOrder || [];
    const missing = standard.filter(s => !current.includes(s));

    if (missing.length > 0) {
      console.log("Restoring missing sections:", missing);
      setForm(prev => ({
        ...prev,
        sectionOrder: [...(prev.sectionOrder || []), ...missing]
      }));
    }
  }, [form.sectionOrder]);

  const [activeTab, setActiveTab] = useState("editor");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Map template IDs to components
  const templates = {
    classic: ResumeTemplateClassic,
    modern: ResumeTemplateModern,
    minimal: ResumeTemplateMinimal,
    "clean-resume": CleanResumeTemplate,
    "dense-ux": TemplateDenseUX,
    "modern-split": TemplateModernSplit,
    "rounded-sections": TemplateRoundedSections,
    "soft-sidebar": TemplateSoftSidebar,
    "clean-single": TemplateCleanSingle
  };

  const TemplateComponent = templates[template] || ResumeTemplateClassic;

  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [checkingScore, setCheckingScore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [atsResult, setAtsResult] = useState(null);

  // ========== Login Check =========
  const requireLogin = () => {
    if (!token || !user) {
      setError("Please login first.");
      return false;
    }
    return true;
  };

  // ========== HELPER: Normalize Data =========
  // ========== HELPER: Normalize Data =========
  const normalizeArray = (value, isSkills = false) => {
    if (!Array.isArray(value)) {
      if (typeof value === "string") {
        // For skills, split by comma. For others (exp/edu), split by newline only.
        const separator = isSkills ? /[,;\n]+/ : /\n+/;
        return value
          .split(separator)
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    }

    // Handle array of objects (Experience/Education)
    return value.map(item => {
      if (typeof item === "string") return item;

      // Experience object
      if (item.title || item.company) {
        const parts = [item.title, item.company].filter(Boolean).join(" at ");
        const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ");
        return `${parts}${dates ? ` (${dates})` : ""}${item.description ? `: ${item.description}` : ""}`;
      }

      // Education object
      if (item.degree || item.institution) {
        const parts = [item.degree, item.institution].filter(Boolean).join(" from ");
        const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ");
        return `${parts}${dates ? ` (${dates})` : ""}${item.gpa ? ` (GPA: ${item.gpa})` : ""}`;
      }

      return JSON.stringify(item);
    });
  };

  // ========== HANDLE FILE UPLOAD =========
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!requireLogin()) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { raw, structured } = res.data;

      if (structured) {
        setForm((prev) => ({
          ...prev,
          fullName: structured.fullName || "",
          email: structured.email || "",
          phone: structured.phone || "",
          location: structured.location || "",
          summary: structured.summary || "",
          skills: normalizeArray(structured.skills, true),
          experience: normalizeArray(structured.experience),
          education: normalizeArray(structured.education),
        }));
      } else {
        // fallback
        setForm((prev) => ({ ...prev, experience: raw }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to read your resume.");
    } finally {
      setUploading(false);
    }
  };

  // ========== AI OPTIMIZE =========
  const handleOptimize = async () => {
    if (!requireLogin()) return;

    const baseText =
      [
        form.fullName,
        form.summary,
        form.skills,
        form.experience,
        form.education,
      ]
        .filter(Boolean)
        .join("\n\n") || form.experience;

    if (!baseText) {
      setError("Please upload a resume first.");
      return;
    }

    setOptimizing(true);
    setError("");

    try {
      const res = await api.post("/resume/optimize", {
        resumeText: baseText,
        jobDescription,
      });

      const improvedData = res.data.improved;

      if (res.data.atsScore) {
        setAtsResult({
          score: res.data.atsScore,
          keywords: res.data.matchedKeywords || [],
          suggestions: res.data.suggestions || []
        });
      }

      setForm((prev) => ({
        ...prev,
        fullName: improvedData.fullName || prev.fullName,
        email: improvedData.email || prev.email,
        phone: improvedData.phone || prev.phone,
        location: improvedData.location || prev.location,
        summary: improvedData.summary || prev.summary,

        skills: normalizeArray(improvedData.skills, true),
        experience: normalizeArray(improvedData.experience),
        education: normalizeArray(improvedData.education),
      }));
    } catch (err) {
      console.error("AI error:", err);
      setError("AI optimization failed. Try again.");
    } finally {
      setOptimizing(false);
    }
  };

  // ========== CHECK ATS SCORE ONLY =========
  const handleCheckScore = async () => {
    if (!requireLogin()) return;

    const baseText =
      [
        form.fullName,
        form.summary,
        form.skills,
        form.experience,
        form.education,
      ]
        .filter(Boolean)
        .join("\n\n") || form.experience;

    if (!baseText) {
      setError("Please upload a resume first.");
      return;
    }

    setCheckingScore(true);
    setError("");

    try {
      const res = await api.post("/resume/optimize", {
        resumeText: baseText,
        jobDescription,
      });

      if (res.data.atsScore) {
        setAtsResult({
          score: res.data.atsScore,
          keywords: res.data.matchedKeywords || [],
          suggestions: res.data.suggestions || []
        });
      }
    } catch (err) {
      console.error("ATS Check error:", err);
      setError("Failed to check ATS score. Try again.");
    } finally {
      setCheckingScore(false);
    }
  };

  // ========== SAVE RESUME =========
  const handleSave = async () => {
    if (!requireLogin()) return;

    setSaving(true);
    setError("");

    try {
      const title = form.fullName || "My ATS Resume";

      const res = await api.post("/resume/save", {
        title,
        templateId: template,
        data: form,
      });

      setResumeId(res.data.resume.id);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  // ========== DOWNLOAD PDF =========
  const handleDownloadPdf = () => {
    if (!resumeId) {
      setError("Please save the resume first.");
      return;
    }
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      return;
    }
    window.open(`http://localhost:5000/api/resume/${resumeId}/pdf?token=${token}`, "_blank");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const templateProps = {
    fullName: form.fullName,
    title: form.title,
    email: form.email,
    phone: form.phone,
    location: form.location,
    github: form.github,
    linkedin: form.linkedin,
    summary: form.summary,
    skills: normalizeArray(form.skills, true),
    experience: normalizeArray(form.experience),
    education: normalizeArray(form.education),
    customSections: form.customSections || [],
    sectionOrder: form.sectionOrder || ["summary", "skills", "experience", "education"],
    design: form.design || initialForm.design
  };

  return (
    <div className="min-h-screen page-bg font-sans selection:bg-cyan-500/30 flex flex-col md:flex-row overflow-hidden">

      {/* SIDEBAR MENU */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] flex flex-col z-20 transition-all duration-300`}>
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          {!isSidebarCollapsed && <h2 className="text-sm font-semibold text-[var(--text-soft)] uppercase tracking-wider">Builder Tools</h2>}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--text-soft)] hover:text-cyan-500 transition-colors mx-auto"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          <button onClick={() => setActiveTab("editor")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeTab === "editor" ? "bg-cyan-500/10 text-cyan-500 font-medium" : "hover:bg-[var(--bg-soft)] text-[var(--text-soft)]"}`} title="Editor">
            <span className="text-lg">📝</span>
            {!isSidebarCollapsed && <span>Editor</span>}
          </button>
          <button onClick={() => setActiveTab("design")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeTab === "design" ? "bg-cyan-500/10 text-cyan-500 font-medium" : "hover:bg-[var(--bg-soft)] text-[var(--text-soft)]"}`} title="Design & Font">
            <span className="text-lg">🎨</span>
            {!isSidebarCollapsed && <span>Design & Font</span>}
          </button>
          <button onClick={() => setActiveTab("ai")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeTab === "ai" ? "bg-cyan-500/10 text-cyan-500 font-medium" : "hover:bg-[var(--bg-soft)] text-[var(--text-soft)]"}`} title="AI & ATS">
            <span className="text-lg">✨</span>
            {!isSidebarCollapsed && <span>AI & ATS</span>}
          </button>
          <button onClick={() => setActiveTab("sections")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeTab === "sections" ? "bg-cyan-500/10 text-cyan-500 font-medium" : "hover:bg-[var(--bg-soft)] text-[var(--text-soft)]"}`} title="Sections">
            <span className="text-lg">📚</span>
            {!isSidebarCollapsed && <span>Sections</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-[var(--border-subtle)] space-y-2">
          <label className="btn-secondary w-full text-center cursor-pointer block text-xs py-2 flex items-center justify-center gap-2" title="Upload Resume">
            <span className="text-base">📤</span>
            {!isSidebarCollapsed && <span>Upload Resume</span>}
            <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileChange} />
          </label>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-2" title="Save Resume">
            <span className="text-base">💾</span>
            {!isSidebarCollapsed && <span>{saving ? "Saving..." : "Save Resume"}</span>}
          </button>
          <button onClick={handleDownloadPdf} className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-2" title="Download PDF">
            <span className="text-base">⬇️</span>
            {!isSidebarCollapsed && <span>Download PDF</span>}
          </button>
          {error && !isSidebarCollapsed && <p className="text-red-400 text-[10px] text-center mt-2">{error}</p>}
        </div>
      </aside>

      {/* MIDDLE PANEL - EDITOR */}
      <section className="flex-1 bg-[var(--bg-page)] overflow-y-auto p-6 border-r border-[var(--border-subtle)] relative">
        <div className="w-full mx-auto pb-20">

          {/* EDITOR TAB */}
          {activeTab === "editor" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">Edit Content</h2>

              <div className="card p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-cyan-500 mb-3">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Full Name" className="input" />
                  <input name="title" value={form.title} onChange={onChange} placeholder="Job Title" className="input" />
                  <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="input" />
                  <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" className="input" />
                  <input name="location" value={form.location} onChange={onChange} placeholder="Location" className="input md:col-span-2" />
                  <input name="github" value={form.github} onChange={onChange} placeholder="GitHub URL" className="input" />
                  <input name="linkedin" value={form.linkedin} onChange={onChange} placeholder="LinkedIn URL" className="input" />
                </div>
              </div>

              <div className="card p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-cyan-500 mb-3">Professional Summary</h3>
                <textarea name="summary" rows={4} value={form.summary} onChange={onChange} className="textarea" placeholder="Write a compelling summary..." />
              </div>

              <div className="card p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-cyan-500 mb-3">Skills</h3>
                <textarea name="skills" rows={3} value={Array.isArray(form.skills) ? form.skills.join(", ") : form.skills} onChange={(e) => setForm(f => ({ ...f, skills: e.target.value.split(",").map(s => s.trim()) }))} className="textarea" placeholder="React, Node.js, Python..." />
              </div>

              <div className="card p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-cyan-500 mb-3">Experience</h3>
                <textarea name="experience" rows={6} value={Array.isArray(form.experience) ? form.experience.join("\n") : form.experience} onChange={(e) => setForm(f => ({ ...f, experience: e.target.value }))} className="textarea" placeholder="• Job Title at Company..." />
              </div>

              <div className="card p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-cyan-500 mb-3">Education</h3>
                <textarea name="education" rows={4} value={Array.isArray(form.education) ? form.education.join("\n") : form.education} onChange={(e) => setForm(f => ({ ...f, education: e.target.value }))} className="textarea" placeholder="• Degree at University..." />
              </div>

              {/* Custom Sections Editor */}
              {form.customSections?.map((section, index) => (
                <div key={section.id || index} className="card p-4 rounded-xl shadow-sm relative group">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      className="bg-transparent text-sm font-semibold text-cyan-500 focus:outline-none border-b border-transparent focus:border-cyan-500 px-1"
                      value={section.title}
                      onChange={(e) => {
                        const newSections = [...form.customSections];
                        newSections[index].title = e.target.value;
                        setForm(f => ({ ...f, customSections: newSections }));
                      }}
                    />
                    <button
                      className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const newSections = form.customSections.filter((_, i) => i !== index);
                        setForm(f => ({
                          ...f,
                          customSections: newSections,
                          sectionOrder: f.sectionOrder.filter(id => id !== section.id)
                        }));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors"
                      onClick={() => {
                        const newSections = [...form.customSections];
                        const current = newSections[index].content || "";
                        newSections[index].content = current + (current ? "\n• " : "• ");
                        setForm(f => ({ ...f, customSections: newSections }));
                      }}
                    >
                      • Add Bullet
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    className="textarea"
                    placeholder="• Achievement 1&#10;• Achievement 2"
                    value={section.content}
                    onChange={(e) => {
                      const newSections = [...form.customSections];
                      newSections[index].content = e.target.value;
                      setForm(f => ({ ...f, customSections: newSections }));
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* DESIGN TAB */}
          {activeTab === "design" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">Design Settings</h2>
              <div className="card p-6 rounded-xl shadow-sm space-y-6">

                {/* Template Selection */}
                <div>
                  <label className="text-xs text-[var(--text-soft)] block mb-2">Template</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(templates).map(t => (
                      <button
                        key={t}
                        onClick={() => setForm(prev => ({ ...prev, design: { ...prev.design, template: t } }))}
                        className={`px-3 py-2 rounded border text-sm capitalize ${form.design?.template === t ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500' : 'border-[var(--border-subtle)] text-[var(--text-soft)] hover:bg-[var(--bg-soft)]'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[var(--text-soft)] block mb-2">Font Family</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['sans', 'serif', 'mono'].map(f => (
                      <button
                        key={f}
                        onClick={() => setForm(prev => ({ ...prev, design: { ...prev.design, font: f } }))}
                        className={`px-3 py-2 rounded border text-sm capitalize ${form.design?.font === f ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500' : 'border-[var(--border-subtle)] text-[var(--text-soft)] hover:bg-[var(--bg-soft)]'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[var(--text-soft)] block mb-2">Font Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['small', 'medium', 'large'].map(s => (
                      <button
                        key={s}
                        onClick={() => setForm(prev => ({ ...prev, design: { ...prev.design, size: s } }))}
                        className={`px-3 py-2 rounded border text-sm capitalize ${form.design?.size === s ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500' : 'border-[var(--border-subtle)] text-[var(--text-soft)] hover:bg-[var(--bg-soft)]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-soft)] block mb-2">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.design?.color || '#0f172a'}
                        onChange={(e) => setForm(prev => ({ ...prev, design: { ...prev.design, color: e.target.value } }))}
                        className="h-10 w-16 rounded cursor-pointer bg-transparent border border-[var(--border-subtle)]"
                      />
                      <span className="text-xs text-[var(--text-soft)]">{form.design?.color}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-soft)] block mb-2">Text Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.design?.textColor || '#334155'}
                        onChange={(e) => setForm(prev => ({ ...prev, design: { ...prev.design, textColor: e.target.value } }))}
                        className="h-10 w-16 rounded cursor-pointer bg-transparent border border-[var(--border-subtle)]"
                      />
                      <span className="text-xs text-[var(--text-soft)]">{form.design?.textColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI TAB */}
          {activeTab === "ai" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">AI Optimization</h2>

              <div className="card p-6 rounded-xl shadow-sm space-y-4">
                <div>
                  <label className="text-xs text-[var(--text-soft)] block mb-2">Target Job Description</label>
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="textarea"
                    placeholder="Paste the job description here to tailor your resume..."
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={handleCheckScore} disabled={checkingScore} className="btn-secondary flex-1">
                    {checkingScore ? "Checking..." : "📊 Check ATS Score"}
                  </button>
                  <button onClick={handleOptimize} disabled={optimizing} className="btn-primary flex-1">
                    {optimizing ? "Optimizing..." : "✨ Refine with AI"}
                  </button>
                </div>
              </div>

              {atsResult && (
                <div className="card p-6 rounded-xl shadow-sm animate-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[var(--text-main)]">ATS Analysis</h3>
                    <span className={`text-2xl font-bold ${atsResult.score >= 80 ? "text-green-400" : atsResult.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                      {atsResult.score}/100
                    </span>
                  </div>

                  {atsResult.keywords?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-[var(--text-soft)] mb-2">Matched Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {atsResult.keywords.map((kw, i) => (
                          <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-500 rounded text-xs border border-cyan-500/20">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {atsResult.suggestions?.length > 0 && (
                    <div>
                      <p className="text-xs text-[var(--text-soft)] mb-2">Suggestions</p>
                      <ul className="space-y-2">
                        {atsResult.suggestions.map((s, i) => (
                          <li key={i} className="text-xs text-[var(--text-soft)] flex gap-2">
                            <span className="text-cyan-500">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECTIONS TAB */}
          {activeTab === "sections" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">Manage Sections</h2>

              <div className="card p-6 rounded-xl shadow-sm">
                <p className="text-sm text-[var(--text-soft)] mb-4">Drag to reorder sections or add new custom ones.</p>

                <Reorder.Group axis="y" values={form.sectionOrder || []} onReorder={(newOrder) => setForm(f => ({ ...f, sectionOrder: newOrder }))} className="space-y-2">
                  {(form.sectionOrder || []).map((sectionId) => {
                    const isCustom = sectionId.startsWith("custom-");
                    const sectionName = isCustom
                      ? form.customSections.find(s => s.id === sectionId)?.title || "Custom Section"
                      : sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

                    return (
                      <Reorder.Item key={sectionId} value={sectionId} className="flex items-center justify-between bg-[var(--bg-page)] p-3 rounded-lg cursor-move hover:bg-[var(--bg-soft)] transition-colors border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                          <span className="text-[var(--text-soft)]">⋮⋮</span>
                          <span className="text-sm font-medium text-[var(--text-main)]">{sectionName}</span>
                        </div>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>

                <button
                  onClick={() => {
                    const newId = `custom-${Date.now()}`;
                    setForm(f => ({
                      ...f,
                      customSections: [...(f.customSections || []), { id: newId, title: "New Section", content: "" }],
                      sectionOrder: [...(f.sectionOrder || []), newId]
                    }));
                    setActiveTab("editor"); // Switch to editor to fill it
                  }}
                  className="mt-4 w-full py-2 border border-dashed border-[var(--border-subtle)] rounded-lg text-[var(--text-soft)] hover:text-cyan-500 hover:border-cyan-500 transition-colors text-sm"
                >
                  + Add Custom Section
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* RIGHT PANEL - PREVIEW */}
      <section className="hidden lg:block w-[50%] bg-[var(--bg-soft)] p-8 overflow-y-auto border-l border-[var(--border-subtle)]">
        <div className="sticky top-8">
          <div className="bg-white rounded shadow-2xl overflow-hidden min-h-[800px] flex justify-center items-start pt-8 bg-slate-100">
            <div
              className="origin-top bg-white shadow-lg"
              style={{
                width: '210mm',
                minHeight: '297mm',
                transform: 'scale(0.8)',
                marginBottom: '-20%' // Compensate for scale space
              }}
            >
              <TemplateComponent data={templateProps} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ResumeBuilder;
