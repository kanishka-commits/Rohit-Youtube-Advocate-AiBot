import React, { useState } from "react";
import { postData } from "../utils/postData";

export default function YouTubePolicyQA() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
        YouTube Policy Q&A
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          className="w-full p-3 border-2 border-red-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-black"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about YouTube policy..."
        />
        <button type="submit" className="btn-primary mt-4 px-6 py-2 text-lg">
          Ask Policy
        </button>
      </form>
      <div className="result-card mt-4">
        {loading ? "⏳ Thinking..." : result}
      </div>
    </section>
  );
}
