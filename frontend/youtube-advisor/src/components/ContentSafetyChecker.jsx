// src/components/ContentSafetyChecker.jsx
import React, { useState } from "react";
import { postData } from "../utils/postData";

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
    <section>
      <h3 className="text-3xl font-extrabold mb-4 flex items-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 38 38"
          fill="none"
          className="mr-2"
        >
          <rect width="38" height="38" rx="10" fill="#FF0000" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        YouTube Content Safety Checker
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border-2 border-red-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-black"
          rows={6}
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your content here..."
        />
        <button type="submit" className="btn-primary mt-4 px-6 py-2 text-lg">
          Check Content Safety
        </button>
      </form>
      <div className="result-card mt-4">
        {loading ? "⏳ Checking..." : result}
      </div>
    </section>
  );
}
