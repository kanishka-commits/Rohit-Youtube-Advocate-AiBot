import React from "react";
import heroImage from "../assets/hero.png"; // rename your image file to hero.png and place it in /src/assets

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Welcome to Advocate AI Bot
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Simplify your YouTube legal journey. Get contract explanations,
          content safety checks, invoices, and instant answers.
        </p>
        <a
          href="/contract-explainer"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>
      <div className="flex-1">
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;
