import React, { useState } from "react";
import "./demo.css";
import boy from "../../assets/images/signdemo4.jpg";
import girl from "../../assets/images/signdemo3.png";
import leftExtra from "../../assets/images/signdemo.jpg";
import rightExtra from "../../assets/images/signdemo2.jpg";

export default function FeelingsGame() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="game-container">
      {/* ===== Hamburger Menu ===== */}
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
          <a href="/SignHome" onClick={toggleMenu}>
            Home
          </a>
          <a href="/SignFeatures" onClick={toggleMenu}>
            Features
          </a>
          <a href="/SignDemo" onClick={toggleMenu}>
            Live Demo
          </a>
          <a href="/MainPage" onClick={toggleMenu}>
            Exit
          </a>
        </div>
      </div>

      {/* Left-most extra image */}
      <div className="extra-character left-extra">
        <img
          src={leftExtra}
          alt="Extra Left"
          className="character-img small"
        />
      </div>

      {/* Left main character */}
      <div className="char left">
        <img src={boy} alt="Boy" className="char-img" />
      </div>

      {/* Center title and button */}
      <div className="center-circle">
        <h1 className="title">SIGNVERSE</h1>
        <p className="subtitle">
          Learn, practice, and recognize ASL signs through interactive gestures
        </p>

        {/* UPDATED BUTTON */}
        <button
          className="try-btn"
          onClick={() => {
            fetch("http://127.0.0.1:5002/run-signverse")
              .then((res) => res.json())
              .then((data) => {
                console.log("SignVerse Started:", data);
              })
              .catch((err) => console.error(err));
          }}
        >
          Start Recognition
        </button>
      </div>

      {/* Right main character */}
      <div className="char right">
        <img src={girl} alt="Girl" className="char-img" />
      </div>

      {/* Right-most extra image */}
      <div className="extra-character right-extra">
        <img
          src={rightExtra}
          alt="Extra Right"
          className="character-img small"
        />
      </div>
    </div>
  );
}
