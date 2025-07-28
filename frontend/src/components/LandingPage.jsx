import React from "react";
import heroImg from "../assets/hero1.png";
import "../styles/LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="hero-text">
        <h1>
          Your <span className="highlight">AI powered</span> legal assistant
        </h1>
        <p>
          Simplify legal tasks like policy reviews, invoice generation, content
          moderation, and more using smart AI tools.
        </p>
        <button className="cta-btn">Get Started</button>
      </div>

      <div className="hero-image">
        <img src={heroImg} alt="Hero" />
      </div>
    </div>
  );
};

export default LandingPage;
