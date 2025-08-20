// // src/components/ContractExplainer.jsx
import React, { useState, useEffect } from "react"; // Import useEffect
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

export default function ContractExplainer() {
  // Initialize state by reading from localStorage first.
  const [text, setText] = useState(() => {
    const savedText = localStorage.getItem("savedContractText");
    return savedText || "";
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Add an effect that saves the text to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("savedContractText", text);
  }, [text]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setResult("⚠️ Please paste your contract text.");
      return;
    }
    setLoading(true);
    const response = await postData("/api/contract/simplify", { text });
    setLoading(false);
    setResult(
      response.error
        ? `❌ Error: ${response.error}`
        : response.summary || "No summary returned."
    );
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Contract Explainer
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste contract text here... your text will be saved as you type."
        />
        <button type="submit" className="btn-primary">
          Simplify Contract
        </button>
      </form>
      <div className="result-card">{loading ? "⏳ Processing..." : result}</div>
    </section>
  );
}
