// // src/components/AMA.jsx

import React, { useState, useEffect } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

export default function AMA() {
  // Initialize state from localStorage, or with an empty string if nothing is saved.
  const [question, setQuestion] = useState(() => {
    const savedQuestion = localStorage.getItem("savedAMAQuestion");
    return savedQuestion || "";
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Save the question to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("savedAMAQuestion", question);
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await postData("/api/ama/ask", { question });
    setLoading(false);
    if (response.error) {
      setResult(`❌ Error: ${response.error}`);
    } else {
      setResult(response.answer || "No answer returned.");
      setQuestion("");
      localStorage.removeItem("savedAMAQuestion");
    }
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube AMA
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question"
        />
        <button type="submit" className="btn-primary">
          Ask YouTube Advisor
        </button>
      </form>
      <div className="result-card">{loading ? "⏳ Thinking..." : result}</div>
    </section>
  );
}
