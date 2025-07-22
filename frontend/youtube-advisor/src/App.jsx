import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ContractExplainer from "./components/ContractExplainer";
import ContentSafetyChecker from "./components/ContentSafetyChecker";
import InvoiceGenerator from "./components/InvoiceGenerator";
import AMA from "./components/AMA";
import YouTubePolicyQA from "./components/YouTubePolicyQA";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ContractExplainer />} />
          <Route path="/content-safety" element={<ContentSafetyChecker />} />
          <Route path="/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/ama" element={<AMA />} />
          <Route path="/policy-qa" element={<YouTubePolicyQA />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
