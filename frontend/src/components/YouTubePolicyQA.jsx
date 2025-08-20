// import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

export default function YouTubePolicyQA() {
  // Initialize state from localStorage, or with an empty string if nothing is saved.
  const [question, setQuestion] = useState(() => {
    const savedQuestion = localStorage.getItem("savedPolicyQuestion");
    return savedQuestion || "";
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Save the question to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("savedPolicyQuestion", question);
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await postData("/api/youtube/policy", { question });
    setLoading(false);
    setResult(
      response.error
        ? `❌ Error: ${response.error}`
        : response.answer || "No answer returned."
    );
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Policy Q&A
      </h3>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about YouTube policy..."
        />
        <button type="submit" className="btn-primary">
          Ask Policy
        </button>
      </form>

      <div className="result-card">{loading ? "⏳ Thinking..." : result}</div>
    </section>
  );
}
