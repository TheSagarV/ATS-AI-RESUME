import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../api/client.js";

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load admin stats (check role & backend).");
      });
  }, []);

  return (
    <>
      <Navbar />
      <main className="page-bg pt-24 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
          {error && <p className="text-xs text-red-300 mb-4">{error}</p>}
          {!stats && !error && (
            <p className="text-xs text-slate-300">Loading stats…</p>
          )}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card">
                <p className="text-xs text-slate-300">Users</p>
                <p className="mt-2 text-2xl font-semibold">{stats.users}</p>
              </div>
              <div className="card">
                <p className="text-xs text-slate-300">Resumes</p>
                <p className="mt-2 text-2xl font-semibold">{stats.resumes}</p>
              </div>
              <div className="card">
                <p className="text-xs text-slate-300">AI Calls</p>
                <p className="mt-2 text-2xl font-semibold">{stats.aiCalls}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminPage;
