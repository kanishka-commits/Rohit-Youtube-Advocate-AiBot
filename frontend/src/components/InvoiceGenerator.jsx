// // src/components/InvoiceGenerator.jsx
import React, { useState } from "react";
import { postData } from "../utils/postData";
import { jsPDF } from "jspdf";
import "../styles/CommonStyles.css";

export default function InvoiceGenerator() {
  const [inputs, setInputs] = useState({
    brand: "",
    service: "",
    amount: "",
    include_gst: true,
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
    setResult(
      response.error
        ? `❌ Error: ${response.error}`
        : response.invoice_text || "No invoice returned."
    );
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(result, 10, 20);
    doc.save(`invoice_${inputs.brand.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <section className="section-container">
      <h3>
        <svg width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="#00ffff" />
          <polygon points="15,12 28,19 15,26" fill="black" />
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
