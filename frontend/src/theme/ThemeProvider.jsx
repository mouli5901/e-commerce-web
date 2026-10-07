// src/theme/ThemeProvider.jsx
import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

/**
 * ThemeProvider reads the saved theme from localStorage (or defaults to
 * prefers‑color‑scheme) and exposes a toggle function. It applies a data attribute
 * on the <html> element so CSS variables defined in tokens.css can switch.
 */
export default function ThemeProvider({ children }) {
  // Default to "dark" to match data-theme="dark" on <html>, avoiding FOUC
  const [theme, setTheme] = useState("dark");

  // Initialise from storage or system preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
