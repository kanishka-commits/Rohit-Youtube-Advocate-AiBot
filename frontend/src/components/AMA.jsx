// // src/components/AMA.jsx

import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

export default function AMA() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await postData("/api/ama/ask", { question });
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
        <svg width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="#00ffff" />
          <polygon points="15,12 28,19 15,26" fill="black" />
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
