import React, { useState } from "react";
import "./vm.css";

// Images (adjust paths if your assets folder is different)
import hero from "../../assets/images/hand.png";
import hero2 from "../../assets/images/robo.png";
import hero3 from "../../assets/images/mike.png";
import trynow from "../../assets/images/vmfeatry.jpg";

import cursor from "../../assets/images/vmfeacursor.jpg";
import voice from "../../assets/images/vmfeavoice.jpg";
import volume from "../../assets/images/vmfeavolume.jpg";
import eye from "../../assets/images/vmfeaeye.jpg";

export default function Vmouse() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="vmouse-page">
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
          <a href="#live-demo" onClick={toggleMenu}>
            Live Demo
          </a>
          <a href="/MainPage" onClick={toggleMenu}>
            Exit
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            Smarter Control With
            <br />
            Virtual Mouse & Voice Assistant.
          </h1>

          <p className="hero-sub">
            Experience the next generation of control — a virtual mouse that
            listens, understands, and responds to your gestures and voice. No
            need to touch your system — just say, move, or blink, and it obeys
            instantly.
          </p>
        </div>

        <div className="hero-right">
          <div className="hero-image-frame">
            <img src={hero} alt="Virtual Mouse Demo" />
          </div>
          <p className="hero-caption">
            Navigate your computer hands-free with voice, eye, and gesture-based
            actions — designed for comfort and accessibility.
          </p>
        </div>
      </section>

      {/* Smart Control Features */}
      <section className="sessions">
        <h2 className="section-title">Smart Control Features</h2>

        <div className="cards">
          <article className="card card-dark">
            <img src={cursor} className="card-img" alt="Gesture Control" />
            <h3>Gesture-Based Cursor</h3>
            <p>
              Control your mouse pointer using your index finger with smooth
              tracking and real-time precision. Move, click, and drag without
              touching the device.
            </p>
          </article>

          <article className="card card-brown">
            <img src={voice} className="card-img" alt="Voice Commands" />
            <h3>Voice Commands</h3>
            <p>
              Speak simple phrases like "Open File Manager", "Play Music", or
              "Open Gallery" — and the virtual mouse executes them instantly
              through its voice recognition engine.
            </p>
          </article>

          <article className="card card-brown">
            <img src={volume} className="card-img" alt="Volume Gestures" />
            <h3>Volume & Media Gestures</h3>
            <p>
              Adjust your system volume, pause or play media using simple hand
              gestures or finger movements — faster and more intuitive than any
              shortcut.
            </p>
          </article>

          <article className="card card-dark">
            <img src={eye} className="card-img" alt="Eye Blink Detection" />
            <h3>Eye Blink Detection</h3>
            <p>
              Perform click actions through smart blink detection — a powerful
              accessibility feature for hands-free interaction and control.
            </p>
          </article>
        </div>
      </section>

      {/* Feature showcase */}
      <section className="showcase">
        <div className="showcase-left">
          <div className="photo-frame">
            <img src={hero2} alt="Gesture demo" />
          </div>
        </div>

        <div className="showcase-right">
          <h2>Experience True Freedom of Control</h2>
          <p>
            The Virtual Mouse blends voice commands, gesture tracking, and eye
            detection to offer a completely touchless experience. Whether you're
            working, designing, or relaxing — control every aspect of your
            system naturally.
          </p>

          <div className="mini-photos">
            <img src={hero3} alt="Voice control" />
            <div className="information-box">
              <h4>Voice + Vision = Power</h4>
              <p>
                Speak to perform, blink to select, or wave to adjust — Virtual
                Mouse makes it all possible with its AI-driven recognition and
                adaptive response learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — INSERT BEFORE LIVE DEMO */}
      <section className="how-works-container">
        <div className="how-works-inner">
          <div className="how-works-left">
            <h2 className="how-works-title">How It Works</h2>
            <p className="how-works-desc">
              Navi Mouse supports four distinct, easy-to-use interaction modes.
              Switch modes with a single key and use simple hand/eye/voice
              gestures to control volume, capture screenshots, operate the
              assistant, or drive the cursor. The system is designed to be
              intuitive — here's how a user activates and uses each mode.
            </p>
          </div>

          <div className="how-works-right">
            <div className="hw-guide" />

            <div className="hw-step">
              <div className="hw-marker">01</div>
              <div className="hw-card">
                <h3>
                  Step 1 — Eye Mode (Press <kbd>E</kbd>)
                </h3>
                <p>
                  Press the <strong>E</strong> key to enable Eye Mode. The
                  system tracks eye focus for navigation. If the user's eyes
                  remain
                  <strong>closed for more than 2 seconds</strong>, the system
                  automatically captures a screenshot.
                </p>
                <p className="hw-note">
                  <em>
                    Use when you want quick screenshots or gaze-driven
                    selection.
                  </em>
                </p>
              </div>
            </div>

            <div className="hw-step">
              <div className="hw-marker">02</div>
              <div className="hw-card">
                <h3>
                  Step 2 — Jarvis Mode (Press <kbd>J</kbd>)
                </h3>
                <p>
                  Press <strong>J</strong> to activate Jarvis Mode — a full
                  voice assistant. Speak supported commands (for example: "Open
                  YouTube", "Scroll down", "Play music") and Jarvis executes
                  them.
                </p>
                <p className="hw-note">
                  <em>
                    Use natural voice phrases; Jarvis listens and runs commands.
                  </em>
                </p>
              </div>
            </div>

            <div className="hw-step">
              <div className="hw-marker">03</div>
              <div className="hw-card">
                <h3>
                  Step 3 — Volume Mode (Press <kbd>V</kbd>)
                </h3>
                <p>
                  Press <strong>V</strong> to enter Volume Mode. Use hand
                  gestures: an <strong>open palm</strong> sets volume to{" "}
                  <strong>100%</strong>, while a <strong>pinch</strong> (thumb +
                  index together) sets it to
                  <strong>0%</strong>. Movements in between interpolate volume.
                </p>
                <p className="hw-note">
                  <em>
                    Use when you want quick media/volume control without
                    touching the device.
                  </em>
                </p>
              </div>
            </div>

            <div className="hw-step">
              <div className="hw-marker">04</div>
              <div className="hw-card">
                <h3>Step 4 — Normal Mode (Default)</h3>
                <p>
                  Normal Mode provides standard cursor control with gestures:
                  the system tracks your <strong>index finger</strong> for
                  cursor movement. Perform a <strong>pinch</strong> (thumb +
                  index) to register a click.
                </p>
                <p className="hw-note">
                  <em>
                    Switch to this mode for precise pointer work and clicking by
                    pinch gesture.
                  </em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="live-demo" id="live-demo">
        <div className="live-left">
          <div className="live-content">
            <h2 className="live-title">
              Unlimited Smart Control — Anytime, Anywhere
            </h2>
            <p className="live-text">
              Experience seamless touchless interaction. Try our live demo to
              see how voice and gesture control make computing effortless.
            </p>

            {/* UPDATED BUTTON */}
            <button
              className="btn live-btn"
              onClick={() => {
                fetch("http://127.0.0.1:5001/run-vmouse")
                  .then((res) => res.json())
                  .then((data) => {
                    console.log("VMOUSE Started:", data);
                  })
                  .catch((err) => console.error(err));
              }}
            >
              Try Now
            </button>
          </div>
        </div>

        <div className="live-right">
          <div className="live-image-frame">
            <img src={trynow} alt="Live Demo" />
          </div>
        </div>
      </section>
    </div>
  );
}
