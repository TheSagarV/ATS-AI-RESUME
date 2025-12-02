// src/components/ThemeToggle.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const ThemeToggle = () => {
  const { theme, cycleTheme } = useTheme();

  const label =
    theme === "theme-navy" ? "Navy" :
    theme === "theme-emerald" ? "Emerald" :
    "White";

  return (
    <button
      onClick={cycleTheme}
      className="inline-flex items-center rounded-full border border-slate-500/60 px-3 py-1 text-xs font-medium text-[var(--text-soft)] hover:text-[var(--accent)] hover:border-[var(--accent-soft)] active:scale-95 transition"
    >
      {label}
    </button>
  );
};

export default ThemeToggle;
