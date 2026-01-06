import React, { useState } from "react";
import "./features.css";

export default function Feature() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="features-container">
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

      {/* Rest of your existing code remains exactly the same */}
      <h1 className="features-heading">Explore the Power of SignVerse</h1>
      <p className="features-subtext">
        A simple, fast, and intuitive way to understand everyday ASL signs through gesture recognition and audio feedback.
      </p>

      <div className="features-grid">
        <div className="feature-card peach">
          <h3>Real-Time ASL Gesture Recognition</h3>
          <p>
            SignVerse identifies 10–11 commonly used and beginner-friendly ASL signs
            such as Hello, Thank You, Yes, No, Please, Sorry, and more. Users simply
            perform a sign, and the system instantly interprets it.
          </p>
        </div>

        <div className="feature-card sky">
          <h3>Gesture-to-Text Output</h3>
          <p>
            The recognized sign is displayed on screen in real-time, allowing
            learners to confirm the correctness of their gesture instantly and
            understand how each sign is interpreted by the model.
          </p>
        </div>

        <div className="feature-card lavender">
          <h3>Audio Feedback System</h3>
          <p>
            Along with the detected text, SignVerse also plays a clear audio
            message describing the meaning of the gesture — for example,
            when the user performs the "Hello" sign, the system says:
            "This is Hello." This helps beginners memorize signs faster.
          </p>
        </div>

        <div className="feature-card mint">
          <h3>Future Expansion</h3>
          <p>
            With better hardware such as GPUs and advanced neural models,
            SignVerse can expand into a complete real-time ASL recognition
            platform supporting a wide range of signs with continuous audio narration,
            making sign language more accessible for everyone.
          </p>
        </div>
      </div>

      {/* WHY SECTION */}
      <div className="why-section">
        <div className="unique-heading">
          <span className="word1">Sign</span>
          <span className="emoji">🤟</span>
          <span className="word2">Verse</span>
        </div>
        <h2 className="why-subheading">
          Because learning sign language should be simple, interactive, and accessible.
        </h2>

        <div className="why-cards">
          <div className="why-card">
            <h3>📘 Beginner-Friendly</h3>
            <p>Includes only the most common ASL signs so anyone can start learning instantly.</p>
          </div>

          <div className="why-card">
            <h3>🖐 Hands-On Interaction</h3>
            <p>Users learn by actually performing gestures — natural, practical, and fun.</p>
          </div>

          <div className="why-card">
            <h3>🔊 Audio Reinforcement</h3>
            <p>Every recognized sign is spoken aloud, helping users remember signs effortlessly.</p>
          </div>

          <div className="why-card">
            <h3>🌍 Future-Ready Vision</h3>
            <p>A stepping stone toward full ASL translation systems powered by AI and better hardware.</p>
          </div>
        </div>
      </div>

      {/* HOW DOES IT WORK SECTION */}
      <div className="process-section">
        <h2 className="process-heading">How Does It Work?</h2>
        <p className="process-subtext">
          A real-time flow — perform a sign, get the meaning instantly through text and audio.
        </p>

        <div className="process-flow">
          <div className="process-step">
            <div className="circle" data-step="1">
              <i className="fas fa-desktop"></i>
            </div>
            <h3>UI Interaction</h3>
            <p>
              Users open SignVerse from the main interface and begin the gesture
              learning experience.
            </p>
          </div>

          <div className="arrow"></div>

          <div className="process-step">
            <div className="circle" data-step="2">
              <i className="fas fa-mouse-pointer"></i>
            </div>
            <h3>Try Now Activation</h3>
            <p>
              On clicking "Try Now," the system requests camera access to start
              reading hand movements.
            </p>
          </div>

          <div className="arrow"></div>

          <div className="process-step">
            <div className="circle" data-step="3">
              <i className="fas fa-camera"></i>
            </div>
            <h3>Gesture Detection</h3>
            <p>
              The model (OpenCV + MediaPipe) detects the hand shape, matches it to
              one of the supported ASL signs, and identifies the gesture in real-time.
            </p>
          </div>

          <div className="arrow"></div>

          <div className="process-step">
            <div className="circle" data-step="4">
              <i className="fas fa-volume-up"></i>
            </div>
            <h3>Output & Audio Response</h3>
            <p>
              The recognized sign appears as text, and audio plays to tell the user
              what the gesture means — for example: "This is Thank You."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}