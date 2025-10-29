import React, { useState, useEffect } from "react";
import "./DarkModeToggle.css";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // khi bật tắt sẽ lưu vào localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div
      className={`toggle-switch ${darkMode ? "dark" : ""}`}
      onClick={toggleDarkMode}
    >
      <div className="toggle-thumb">
        {darkMode ? 
        <span className="material-symbols-outlined">dark_mode</span> : 
        <span className="material-symbols-outlined">light_mode</span>}
      </div>
    </div>
  );
}

export default DarkModeToggle;
