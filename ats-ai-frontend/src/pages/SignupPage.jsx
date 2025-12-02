import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const SignupPage = () => {
  const { login } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      login(res.data.token, res.data.user);
      nav("/resume");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-bg pt-28 pb-12 flex items-start justify-center px-4">
        <div className="w-full max-w-md form-card">
          <h1 className="text-xl font-semibold mb-1 text-[var(--text-main)]">
            Create account
          </h1>
          <p className="text-xs text-[var(--text-soft)] mb-4">
            Start generating ATS-optimized resumes with AI.
          </p>

          {error && (
            <div className="mb-3 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3 text-xs">
            <div>
              <label className="label">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                className="input"
              />
            </div>
            <button
              disabled={loading}
              className="w-full btn-primary mt-2 disabled:opacity-70"
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-[var(--text-soft)]">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--accent)] hover:text-[var(--accent-2)]">
              Login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default SignupPage;
