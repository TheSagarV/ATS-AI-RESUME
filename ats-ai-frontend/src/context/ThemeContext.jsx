// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "theme-navy",
  cycleTheme: () => {},
});

const THEMES = ["theme-navy", "theme-emerald", "theme-white"];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ats_theme") || "theme-navy"
  );

  useEffect(() => {
    const html = document.documentElement;

    THEMES.forEach((t) => html.classList.remove(t));
    html.classList.add(theme);

    localStorage.setItem("ats_theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
