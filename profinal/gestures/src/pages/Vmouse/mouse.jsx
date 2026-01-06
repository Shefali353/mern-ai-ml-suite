import React, { useEffect, useState } from "react";
import "./mouse.css";
import gesture from "../../assets/images/vmousehomeges.jpg";
import eye from "../../assets/images/vmousehomeeye.jpg";
import mic from "../../assets/images/vmousehomemic.jpg";
import hand from "../../assets/images/vmousehomehand.jpg";
import inovation from "../../assets/images/vmousehomeino.jpg";

export default function Mouse() {
  const [displayedWords, setDisplayedWords] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headingText = "Redefining Touchless Experience";

  useEffect(() => {
    const words = headingText.split(" ");
    words.forEach((word, index) => {
      setTimeout(() => {
        setDisplayedWords((prev) => [...prev, word]);
      }, index * 2000); // 2 seconds delay per word
    });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="mouse-container">
      {/* Hamburger Menu */}
      <div className="hamburger-menu">
        <div
          className={`hamburger-icon ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={`menu-content ${isMenuOpen ? "open" : ""}`}>
          <a href="/Vmouse" onClick={toggleMenu}>
            Home
          </a>
          <a href="/VMFeatures" onClick={toggleMenu}>
            Features
          </a>
          <a href="/MainPage" onClick={toggleMenu}>
            Exit
          </a>
        </div>
      </div>

      {/* ✨ Animated Soft Heading */}
      <h1 className="animated-top-heading">{displayedWords.join(" ")}</h1>

      {/* Left Vertical Text */}
      <div className="side-text">
        NAVI
        <br />
        MOUSE
      </div>

      <div className="hero" id="home">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1>Experience the Future of Touchless Control</h1>
          <p>Interact seamlessly with intelligent, contact-free navigation.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features" id="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src={hand} alt="Gesture Control" />
            <h3>Gesture Control</h3>
            <p>Move your cursor and click using simple hand gestures.</p>
          </div>
          <div className="feature-card">
            <img src={eye} alt="Eye Tracking" />
            <h3>Eye Tracking</h3>
            <p>Navigate effortlessly with eye movement precision.</p>
          </div>
          <div className="feature-card">
            <img src={mic} alt="Voice Commands" />
            <h3>Voice Commands</h3>
            <p>Speak to execute — from opening apps to adjusting volume.</p>
          </div>
          <div className="feature-card">
            <img src={gesture} alt="Custom Actions" />
            <h3>Custom Actions</h3>
            <p>Create personalized gesture shortcuts for your workflow.</p>
          </div>
        </div>
      </div>

      {/* WHY UNIQUE SECTION */}
      <div className="unique-section">
        <h2 className="unique-heading">Why Unique & Why Use Us</h2>

        <div className="unique-flow">
          <div className="flow-item">
            <div className="flow-circle">01</div>
            <div className="flow-box">
              <h3>Seamless Interaction</h3>
              <p>
                Our AI-powered design ensures fluid, natural control — no clicks
                or wires needed.
              </p>
            </div>
          </div>

          <div className="flow-item reverse">
            <div className="flow-circle">02</div>
            <div className="flow-box">
              <h3>Intuitive Learning</h3>
              <p>
                Navi Mouse learns your gestures and voice tone for smarter
                response over time.
              </p>
            </div>
          </div>

          <div className="flow-item">
            <div className="flow-circle">03</div>
            <div className="flow-box">
              <h3>Universal Compatibility</h3>
              <p>Works across devices and operating systems effortlessly.</p>
            </div>
          </div>

          <div className="flow-item reverse">
            <div className="flow-circle">04</div>
            <div className="flow-box">
              <h3>Future-Ready Design</h3>
              <p>
                Crafted for comfort, speed, and innovation — built for
                tomorrow's world.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <div className="footer-text">
          <h2>Innovation That Moves With You</h2>
          <p>
            The future of control is here — Navi Mouse transforms your everyday
            computing into a seamless, touch-free experience.
          </p>
        </div>
        <div className="footer-img">
          <img src={inovation} alt="Navi Mouse" />
        </div>
      </div>
    </div>
  );
}
