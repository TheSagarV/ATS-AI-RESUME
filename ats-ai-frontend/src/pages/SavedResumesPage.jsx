import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const SavedResumesPage = () => {
  const { user, token, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setError("Please login to see your saved resumes.");
        return;
      }
      try {
        const res = await api.get("/resume/my");
        setResumes(res.data.resumes || []);
      } catch (err) {
        console.error("Load resumes error:", err);
        if (err.response?.status === 401) {
          logout();
          setError("Session expired. Please login again.");
        } else {
          setError(err.response?.data?.error || "Failed to load resumes.");
        }
      }
    };
    load();
  }, [user, logout]);

  const openPdf = (id) => {
    if (!token) {
      setError("Authentication missing. Please login.");
      return;
    }
    window.open(`http://localhost:5000/api/resume/${id}/pdf?token=${token}`, "_blank");
  };

  const handleDelete = async (id) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete resume. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-bg pt-24 px-4 pb-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Resumes</h1>
              <p className="text-slate-400 text-sm">Manage and download your saved resumes.</p>
            </div>
            <button
              onClick={() => nav("/builder")}
              className="btn-primary flex items-center gap-2"
            >
              <span>+ Create New</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg mb-6 flex items-center gap-2">
              <span>⚠</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!user && (
            <div className="text-center py-20">
              <p className="text-slate-400 mb-4">Please login to view your resumes.</p>
              <button className="btn-primary" onClick={() => nav("/login")}>Go to Login</button>
            </div>
          )}

          {user && (
            <>
              {resumes.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                  <div className="text-6xl mb-4 opacity-20">📄</div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No resumes yet</h3>
                  <p className="text-slate-500 mb-6">Create your first professional resume in minutes.</p>
                  <button className="btn-primary" onClick={() => nav("/builder")}>Start Building</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map((r) => (
                    <div
                      key={r.id}
                      className="group relative bg-slate-900/40 border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/10"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center border border-slate-700/50 group-hover:border-cyan-500/20">
                          <span className="text-xl">📄</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-950/50 px-2 py-1 rounded border border-slate-800">
                          {r.template_id.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg text-slate-100 mb-1 truncate pr-2" title={r.title}>
                        {r.title || "Untitled Resume"}
                      </h3>
                      <p className="text-xs text-slate-400 mb-6">
                        Created {new Date(r.created_at).toLocaleDateString()}
                      </p>

                      <div className="flex gap-3 mt-auto pt-4 border-t border-slate-800/50">
                        <button
                          className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-400 transition-colors flex items-center justify-center gap-2"
                          onClick={() => openPdf(r.id)}
                        >
                          <span>Download PDF</span>
                        </button>
                        <button
                          className={`px-3 py-2 rounded-lg transition-colors border border-transparent text-[11px] ${confirmDeleteId === r.id
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/20"
                            }`}
                          onClick={() => handleDelete(r.id)}
                          disabled={deletingId === r.id}
                          title="Delete Resume"
                        >
                          {deletingId === r.id ? (
                            <span className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          ) : confirmDeleteId === r.id ? (
                            "Confirm?"
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default SavedResumesPage;
