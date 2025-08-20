import React, { useState, useEffect } from "react"; // Import useEffect
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

export default function ContentSafetyChecker() {
  // MODIFICATION: Initialize state from localStorage, or with an empty string if nothing is saved.
  const [script, setScript] = useState(() => {
    const savedScript = localStorage.getItem("savedUserScript");
    return savedScript || "";
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // MODIFICATION: Add a useEffect hook to save the script to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("savedUserScript", script);
  }, [script]); // This effect runs every time the 'script' state changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await postData("/api/content/check", { text: script });
    setLoading(false);
    setResult(
      response.error
        ? `❌ Error: ${response.error}`
        : response.report || "No report returned."
    );
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Content Safety Checker
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your content here... it will be saved automatically."
        />
        <button type="submit" className="btn-primary">
          Check Content Safety
        </button>
      </form>
      <div className="result-card">{loading ? "⏳ Checking..." : result}</div>
    </section>
  );
}
