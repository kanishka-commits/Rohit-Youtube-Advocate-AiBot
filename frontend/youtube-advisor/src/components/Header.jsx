// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/content-safety", label: "Content Safety" },
    { to: "/invoice-generator", label: "Invoice Generator" },
    { to: "/ama", label: "AMA" },
    { to: "/policy-qa", label: "Policy Q&A" },
  ];
  return (
    <header className="bg-black shadow-lg sticky top-0 z-50 border-b-4 border-red-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <rect width="38" height="38" rx="10" fill="#FF0000" />
              <polygon points="15,12 28,19 15,26" fill="white" />
            </svg>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              YouTube Advisor
            </span>
          </span>
        </div>
        <nav className="hidden md:flex space-x-8 text-white font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white ${
                location.pathname === link.to ? "bg-red-600 text-white" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-7 h-7 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <nav
        className={`md:hidden bg-black border-t border-red-600 transition-all duration-300 ${
          isOpen ? "max-h-96 py-2" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col space-y-2 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors duration-200 ${
                location.pathname === link.to
                  ? "bg-red-600 text-white"
                  : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
