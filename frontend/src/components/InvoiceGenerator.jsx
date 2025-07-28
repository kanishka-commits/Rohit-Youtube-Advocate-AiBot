// src/components/InvoiceGenerator.jsx
import React, { useState } from "react";
import { postData } from "../utils/postData";
import { jsPDF } from "jspdf";

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
        YouTube Invoice Generator
      </h3>
      <form onSubmit={handleSubmit}>
        <input
          id="brand"
          type="text"
          value={inputs.brand}
          onChange={handleChange}
          placeholder="Brand or Sponsor"
          className="w-full mb-2 p-3 border-2 border-red-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-black"
        />
        <input
          id="service"
          type="text"
          value={inputs.service}
          onChange={handleChange}
          placeholder="Service Description"
          className="w-full mb-2 p-3 border-2 border-red-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-black"
        />
        <input
          id="amount"
          type="number"
          value={inputs.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full mb-2 p-3 border-2 border-red-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-black"
        />
        <label className="flex items-center space-x-2 mb-2">
          <input
            id="include_gst"
            type="checkbox"
            checked={inputs.include_gst}
            onChange={handleChange}
            className="accent-red-600"
          />
          <span className="text-black">Include GST (18%)</span>
        </label>
        <button type="submit" className="btn-primary mt-4 px-6 py-2 text-lg">
          Generate Invoice
        </button>
      </form>
      {result && (
        <div className="result-card mt-4 whitespace-pre-wrap">
          {result}
          {!loading && !result.startsWith("❌") && (
            <button
              onClick={downloadPDF}
              className="mt-3 btn-primary px-4 py-2 text-base"
            >
              Download PDF
            </button>
          )}
        </div>
      )}
    </section>
  );
}
