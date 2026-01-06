import React, { useState } from "react";
import "./home.css";
import moodverse from "../../assets/images/signversehome.jpg"; // same image

const MusicMood = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const moods = [
    {
      title: "Basic Hand Signs",
      desc: "Learn essential ASL gestures that are recognized instantly with high accuracy.",
      icon: "🤟",
    },
    {
      title: "Real-Time Feedback",
      desc: "Get immediate on-screen results as every gesture is interpreted by the system.",
      icon: "👀",
    },
    {
      title: "Audio Response",
      desc: "Every recognized sign is spoken aloud, helping users learn through sound.",
      icon: "🔊",
    },
  ];

  return (
    <div className="mood-main">
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
      {/* ===== Hero Section ===== */}
      <section className="hero-section">
        <h1>Explore ASL Through Gestures</h1>
        <p>
          SignVerse lets you perform simple and commonly used sign language
          gestures, and instantly see and hear what each gesture means.
        </p>
      </section>

      {/* ===== Discover Your Vibe Section ===== */}
      <section className="mood-section">
        <h2>Learn Common ASL Signs</h2>
        <p>Practice real gestures and understand their meaning instantly</p>

        <div className="mood-card-container">
          <div className="mood-card">
            <div className="mood-icon">🤟</div>
            <h3>"Hello" Sign</h3>
            <p>
              Perform the simple ASL gesture for Hello, and watch SignVerse
              recognize it instantly.
            </p>
            <p>
              You will also hear an audio response saying the sign clearly.
            </p>
          </div>

          <div className="mood-card">
            <div className="mood-icon">🙏</div>
            <h3>"Thank You" Sign</h3>
            <p>
              The system detects your Thank You gesture with ease and displays
              the meaning on screen.
            </p>
            <p>
              A voice output also plays, helping learners pick up pronunciation.
            </p>
          </div>

          <div className="mood-card">
            <div className="mood-icon">👌</div>
            <h3>"Yes / No / Please" Signs</h3>
            <p>
              Perform daily-use ASL gestures and receive fast, accurate
              recognition from the system.
            </p>
            <p>
              Sound feedback guides new learners while practicing.
            </p>
          </div>

          <div className="mood-card">
            <div className="mood-icon">✋</div>
            <h3>More Everyday Gestures</h3>
            <p>
              SignVerse supports 10–11 easy and essential ASL gestures that are
              used frequently in daily communication.
            </p>
            <p>
              Visual and audio responses make learning intuitive and enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Future Scope Section ===== */}
      <section className="future-scope-section">
        <div className="future-content">
          <div className="future-text">
            <h2 className="color-heading">FUTURE SCOPE </h2>
            <h3 className="color-heading">& REACHABILITY</h3>

            <p>
              As technology evolves, <strong>SignVerse</strong> can expand from
              basic gestures to complete sign language interpretation. With
              stronger GPUs and larger neural networks, it can support a wide
              range of advanced ASL signs with more precision.
            </p>

            <p>
              The system can also offer continuous <strong>audio explanations</strong> 
              for each gesture, making SignVerse a powerful educational tool for 
              both hearing and speech-impaired users — and for anyone learning ASL.
            </p>
          </div>

          <div className="future-image">
            <img src={moodverse} alt="AI and Human Connection" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MusicMood;