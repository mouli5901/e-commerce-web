import React, { useContext } from "react";
import { ThemeContext } from "../../theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className="btn-toggle"
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
