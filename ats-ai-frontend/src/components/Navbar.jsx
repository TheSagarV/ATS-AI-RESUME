// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative text-xs md:text-sm font-medium ${
      isActive(path)
        ? "text-[var(--accent)]"
        : "text-[var(--text-soft)]"
    } hover:text-[var(--accent)] transition`;

  return (
    <header className="fixed top-4 left-1/2 z-40 w-[94%] max-w-6xl -translate-x-1/2">
      <nav className="nav-shell flex items-center justify-between px-5 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-sm font-bold text-slate-950 shadow-pop">
            ATS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm md:text-base font-semibold tracking-wide text-[var(--text-main)]">
              ATS Resume AI
            </span>
            <span className="text-[10px] text-[var(--text-soft)]">
              AI-powered ATS-friendly resumes
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>
          <Link to="/resume" className={navLinkClass("/resume")}>
            Resume Builder
          </Link>
          <Link to="/templates" className={navLinkClass("/templates")}>
            Templates
          </Link>
          <Link to="/saved" className={navLinkClass("/saved")}>
            Saved Resumes
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-[11px] text-[var(--text-soft)]">
                Hi, <span className="font-semibold text-[var(--text-main)]">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </span>
              <button
                onClick={logout}
                className="hidden md:inline-flex btn-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-flex btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-xs">
                Sign Up
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
