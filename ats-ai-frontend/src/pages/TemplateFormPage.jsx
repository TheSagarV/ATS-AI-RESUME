// src/pages/TemplateFormPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, Reorder } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import { getTemplateById } from "../templates/templatesRegistry.js";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";

const initialForm = {
  fullName: "Your Name",
  title: "Your Role / Title",
  email: "you@example.com",
  phone: "+91-00000-00000",
  location: "City, Country",
  github: "github.com/username",
  linkedin: "linkedin.com/in/username",
  summary:
    "Add a short professional summary tailored to your target role. Highlight your best strengths, experience, and outcomes.",
  skills:
    "React, Tailwind, Node.js, PostgreSQL, TypeScript, REST APIs, Git, Testing",
  experience: `Job Title — Company Name
2022 - Present
• Add 2–4 bullet points of impact.
• Mention metrics, technologies, and responsibilities.

Previous Role — Previous Company
2019 - 2022
• Another set of bullet points.`,
  education: `Degree / Course — University Name
2017 - 2021

Relevant Coursework / Highlights`,
  customSections: [],
  sectionOrder: ["summary", "skills", "experience", "education"],
  design: {
    font: 'sans',
    size: 'medium',
    color: '#0f172a',
    textColor: '#334155'
  }
};

const TemplateFormPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem("resume_form_data");
      if (saved) {
        const parsed = JSON.parse(saved);
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

  // Sync templateId from URL to form state
  useEffect(() => {
    if (templateId && form.design?.template !== templateId) {
      setForm(prev => ({
        ...prev,
        design: { ...prev.design, template: templateId }
      }));
    }
  }, [templateId]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("resume_form_data", JSON.stringify(form));
  }, [form]);

  const selected = getTemplateById(templateId || form.design?.template || "classic");
  const TemplateComponent = selected?.Component;

  // State for actions
  const [activeTab, setActiveTab] = useState("editor"); // editor, design, ai, settings
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [checkingScore, setCheckingScore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Helper: Normalize Data
  const normalizeArray = (value, isSkills = false) => {
    if (!Array.isArray(value)) {
      if (typeof value === "string") {
        const separator = isSkills ? /[,;\n]+/ : /\n+/;
        return value.split(separator).map((s) => s.trim()).filter(Boolean);
      }
      return [];
    }
    return value.map(item => {
      if (typeof item === "string") return item;
      if (item.title || item.company) {
        const parts = [item.title, item.company].filter(Boolean).join(" at ");
        const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ");
        return `${parts}${dates ? ` (${dates})` : ""}${item.description ? `: ${item.description}` : ""}`;
      }
      if (item.degree || item.institution) {
        const parts = [item.degree, item.institution].filter(Boolean).join(" from ");
        const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ");
        return `${parts}${dates ? ` (${dates})` : ""}${item.gpa ? ` (GPA: ${item.gpa})` : ""}`;
      }
      return JSON.stringify(item);
    });
  };

  // Actions
  const requireLogin = () => {
    if (!token || !user) {
      setError("Please login first.");
      return false;
    }
    return true;
  };

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
          skills: normalizeArray(structured.skills, true).join(", "),
          experience: normalizeArray(structured.experience).join("\n\n"),
          education: normalizeArray(structured.education).join("\n\n"),
        }));
      } else {
        setForm((prev) => ({ ...prev, experience: raw }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to read your resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleOptimize = async () => {
    if (!requireLogin()) return;
    const baseText = [form.fullName, form.summary, form.skills, form.experience, form.education].filter(Boolean).join("\n\n");
    if (!baseText) { setError("Please fill in some details first."); return; }

    setOptimizing(true);
    setError("");
    try {
      const res = await api.post("/resume/optimize", { resumeText: baseText, jobDescription });
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
        skills: normalizeArray(improvedData.skills, true).join(", "),
        experience: normalizeArray(improvedData.experience).join("\n\n"),
        education: normalizeArray(improvedData.education).join("\n\n"),
      }));
    } catch (err) {
      console.error("AI error:", err);
      setError("AI optimization failed.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleCheckScore = async () => {
    if (!requireLogin()) return;
    const baseText = [form.fullName, form.summary, form.skills, form.experience, form.education].filter(Boolean).join("\n\n");
    if (!baseText) { setError("Please fill in some details first."); return; }

    setCheckingScore(true);
    setError("");
    try {
      const res = await api.post("/resume/optimize", { resumeText: baseText, jobDescription });
      if (res.data.atsScore) {
        setAtsResult({
          score: res.data.atsScore,
          keywords: res.data.matchedKeywords || [],
          suggestions: res.data.suggestions || []
        });
      }
    } catch (err) {
      console.error("ATS Check error:", err);
      setError("Failed to check ATS score.");
    } finally {
      setCheckingScore(false);
    }
  };

  const handleSave = async () => {
    if (!requireLogin()) return;
    setSaving(true);
    setError("");
    try {
      const title = form.fullName || "My ATS Resume";
      const res = await api.post("/resume/save", {
        title,
        templateId: templateId || "classic",
        data: form,
      });
      setResumeId(res.data.resume.id);
      alert("Resume saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!resumeId) { setError("Please save the resume first."); return; }
    if (!token) { setError("Please log in again."); return; }
    window.open(`http://localhost:5000/api/resume/${resumeId}/pdf?token=${token}`, "_blank");
  };

  if (!selected || !TemplateComponent) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Template not found.</div>;
  }

  const templateProps = {
    ...form,
    skills: normalizeArray(form.skills, true),
    experience: normalizeArray(form.experience),
    education: normalizeArray(form.education),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="pt-20 h-screen flex flex-col md:flex-row overflow-hidden">

        {/* SIDEBAR MENU */}
        <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-900 border-r border-slate-800 flex flex-col z-20 transition-all duration-300`}>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            {!isSidebarCollapsed && <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Builder Tools</h2>}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors mx-auto"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? "»" : "«"}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            <button onClick={() => setActiveTab("editor")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeTab === "editor" ? "bg-cyan-900/30 text-cyan-400" : "hover:bg-slate-800 text-slate-300"}`} title="Editor">
              <span className="text-lg">📝</span>
              {!isSidebarCollapsed && <span>Editor</span>}
            </button>
            <button onClick={() => setActiveTab("design")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeTab === "design" ? "bg-cyan-900/30 text-cyan-400" : "hover:bg-slate-800 text-slate-300"}`} title="Design & Font">
              <span className="text-lg">🎨</span>
              {!isSidebarCollapsed && <span>Design & Font</span>}
            </button>
            <button onClick={() => setActiveTab("ai")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeTab === "ai" ? "bg-cyan-900/30 text-cyan-400" : "hover:bg-slate-800 text-slate-300"}`} title="AI & ATS">
              <span className="text-lg">✨</span>
              {!isSidebarCollapsed && <span>AI & ATS</span>}
            </button>
            <button onClick={() => setActiveTab("sections")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeTab === "sections" ? "bg-cyan-900/30 text-cyan-400" : "hover:bg-slate-800 text-slate-300"}`} title="Sections">
              <span className="text-lg">📚</span>
              {!isSidebarCollapsed && <span>Sections</span>}
            </button>
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-2">
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
        <section className="flex-1 bg-slate-900/50 overflow-y-auto p-6 border-r border-slate-800 relative">
          <div className="max-w-2xl mx-auto pb-20">

            {/* EDITOR TAB */}
            {activeTab === "editor" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-white mb-4">Edit Content</h2>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3">Personal Details</h3>
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

                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3">Professional Summary</h3>
                  <textarea name="summary" rows={4} value={form.summary} onChange={onChange} className="textarea" placeholder="Write a compelling summary..." />
                </div>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3">Skills</h3>
                  <textarea name="skills" rows={3} value={form.skills} onChange={onChange} className="textarea" placeholder="React, Node.js, Python..." />
                </div>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3">Experience</h3>
                  <textarea name="experience" rows={6} value={form.experience} onChange={onChange} className="textarea" placeholder="• Job Title at Company..." />
                </div>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3">Education</h3>
                  <textarea name="education" rows={4} value={form.education} onChange={onChange} className="textarea" placeholder="• Degree at University..." />
                </div>

                {/* Custom Sections Editor */}
                {form.customSections?.map((section, index) => (
                  <div key={section.id || index} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 relative group">
                    <div className="flex justify-between items-center mb-2">
                      <input
                        className="bg-transparent text-sm font-semibold text-cyan-400 focus:outline-none border-b border-transparent focus:border-cyan-500 px-1"
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
                    <textarea
                      rows={4}
                      className="textarea"
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
                <h2 className="text-xl font-bold text-white mb-4">Design Settings</h2>
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 space-y-6">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Font Family</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['sans', 'serif', 'mono'].map(f => (
                        <button
                          key={f}
                          onClick={() => setForm(prev => ({ ...prev, design: { ...prev.design, font: f } }))}
                          className={`px-3 py-2 rounded border text-sm capitalize ${form.design?.font === f ? 'border-cyan-500 bg-cyan-900/20 text-cyan-300' : 'border-slate-700 text-slate-400'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Font Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['small', 'medium', 'large'].map(s => (
                        <button
                          key={s}
                          onClick={() => setForm(prev => ({ ...prev, design: { ...prev.design, size: s } }))}
                          className={`px-3 py-2 rounded border text-sm capitalize ${form.design?.size === s ? 'border-cyan-500 bg-cyan-900/20 text-cyan-300' : 'border-slate-700 text-slate-400'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={form.design?.color || '#0f172a'}
                          onChange={(e) => setForm(prev => ({ ...prev, design: { ...prev.design, color: e.target.value } }))}
                          className="h-10 w-16 rounded cursor-pointer bg-transparent border border-slate-700"
                        />
                        <span className="text-xs text-slate-500">{form.design?.color}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-2">Text Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={form.design?.textColor || '#334155'}
                          onChange={(e) => setForm(prev => ({ ...prev, design: { ...prev.design, textColor: e.target.value } }))}
                          className="h-10 w-16 rounded cursor-pointer bg-transparent border border-slate-700"
                        />
                        <span className="text-xs text-slate-500">{form.design?.textColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI TAB */}
            {activeTab === "ai" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-white mb-4">AI Optimization</h2>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Target Job Description</label>
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
                  <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">ATS Analysis</h3>
                      <span className={`text-2xl font-bold ${atsResult.score >= 80 ? "text-green-400" : atsResult.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                        {atsResult.score}/100
                      </span>
                    </div>

                    {atsResult.keywords?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-400 mb-2">Matched Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {atsResult.keywords.map((kw, i) => (
                            <span key={i} className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded text-xs border border-cyan-900/50">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {atsResult.suggestions?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Suggestions</p>
                        <ul className="space-y-2">
                          {atsResult.suggestions.map((s, i) => (
                            <li key={i} className="text-xs text-slate-300 flex gap-2">
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
                <h2 className="text-xl font-bold text-white mb-4">Manage Sections</h2>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-4">Drag to reorder sections or add new custom ones.</p>

                  <Reorder.Group axis="y" values={form.sectionOrder || []} onReorder={(newOrder) => setForm(f => ({ ...f, sectionOrder: newOrder }))} className="space-y-2">
                    {(form.sectionOrder || []).map((sectionId) => {
                      const isCustom = sectionId.startsWith("custom-");
                      const sectionName = isCustom
                        ? form.customSections.find(s => s.id === sectionId)?.title || "Custom Section"
                        : sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

                      return (
                        <Reorder.Item key={sectionId} value={sectionId} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg cursor-move hover:bg-slate-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">⋮⋮</span>
                            <span className="text-sm font-medium text-slate-200">{sectionName}</span>
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
                    className="mt-4 w-full py-2 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-colors text-sm"
                  >
                    + Add Custom Section
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* RIGHT PANEL - PREVIEW */}
        <section className="hidden lg:block w-[45%] bg-slate-950 p-8 overflow-y-auto border-l border-slate-800">
          <div className="sticky top-8">
            <div className="bg-white rounded shadow-2xl overflow-hidden min-h-[800px] flex justify-center items-start pt-8 bg-slate-100">
              <div
                className="origin-top bg-white shadow-lg"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  transform: 'scale(0.65)',
                  marginBottom: '-30%' // Compensate for scale space
                }}
              >
                <TemplateComponent data={templateProps} />
              </div>
            </div>
          </div>
        </section>

      </main >
    </div >
  );
};

export default TemplateFormPage;
