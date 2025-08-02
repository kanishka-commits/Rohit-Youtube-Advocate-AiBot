// // src/components/ContentSafetyChecker.jsx

import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

export default function ContentSafetyChecker() {
  const [script, setScript] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
        <svg width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="#00ffff" />
          <polygon points="15,12 28,19 15,26" fill="black" />
        </svg>
        YouTube Content Safety Checker
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your content here..."
        />
        <button type="submit" className="btn-primary">
          Check Content Safety
        </button>
      </form>
      <div className="result-card">{loading ? "⏳ Checking..." : result}</div>
    </section>
  );
}
