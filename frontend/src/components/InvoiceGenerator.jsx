// // src/components/InvoiceGenerator.jsx
import React, { useState, useEffect } from "react";
import { postData } from "../utils/postData";
import { jsPDF } from "jspdf";
import "../styles/CommonStyles.css";

export default function InvoiceGenerator() {
  // Initialize state by reading the saved inputs object from localStorage.
  const [inputs, setInputs] = useState(() => {
    const saved = localStorage.getItem("savedInvoiceInputs");
    // If there's saved data, parse it from JSON; otherwise, use the default state.
    return saved ? JSON.parse(saved) : {
      brand: "",
      service: "",
      amount: "",
      include_gst: true,
    };
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Save the entire inputs object to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("savedInvoiceInputs", JSON.stringify(inputs));
  }, [inputs]);
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await postData("/api/invoice/generate", inputs);
    setLoading(false);
    if (response.error) {
      setResult(`❌ Error: ${response.error}`);
    } else {
      setResult(response.answer || "No answer returned.");
      setInputs("");
      localStorage.removeItem("savedInvoiceInputs");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(result, 10, 20);
    doc.save(`invoice_${inputs.brand.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Invoice Generator
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          id="brand"
          type="text"
          value={inputs.brand}
          onChange={handleChange}
          placeholder="Brand or Sponsor"
          className="input-field"
        />
        <input
          id="service"
          type="text"
          value={inputs.service}
          onChange={handleChange}
          placeholder="Service Description"
          className="input-field"
        />
        <input
          id="amount"
          type="number"
          value={inputs.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="input-field"
        />

        <label className="checkbox-label">
          <input
            id="include_gst"
            type="checkbox"
            checked={inputs.include_gst}
            onChange={handleChange}
          />
          <span>Include GST (18%)</span>
        </label>

        <button type="submit" className="btn-primary">
          Generate Invoice
        </button>
      </form>

      {result && (
        <div className="result-card" style={{ whiteSpace: "pre-wrap" }}>
          {result}
          {!loading && !result.startsWith("❌") && (
            <button
              onClick={downloadPDF}
              className="btn-primary"
              style={{ marginTop: "1rem" }}
            >
              Download PDF
            </button>
          )}
        </div>
      )}
    </section>
  );
}
