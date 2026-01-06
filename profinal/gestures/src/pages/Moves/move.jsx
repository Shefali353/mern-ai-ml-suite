import React from "react";
import "../Powers/power.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import lightning from "../../assets/images/lightning.jpg";
import meteor from "../../assets/images/meteordrop.jpg";
import shield from "../../assets/images/shield.jpg";

export default function Moves() {
  const navigate = useNavigate();

  return (
    <div className="moves-container">
      {/* ===== Arrows ===== */}
      <button className="arrow-btn left" onClick={() => navigate("/powers")}>
        <ChevronLeft size={40} />
      </button>

      {/* Right arrow → goes to strengths page */}
      <button className="arrow-btn right" onClick={() => navigate("/strengths")}>
        <ChevronRight size={40} />
      </button>

      {/* ===== Title ===== */}
      <h1 className="moves-title">WONDERS OF MOVES</h1>

      {/* ===== Cards Grid ===== */}
      <div className="moves-grid">
        <div className="move-card">
          <img src={lightning} alt="Mystic Bolt" />
          <h2>Mystic Bolt</h2>
          <p>A blindingly quick electrical discharge that pierces through mystical defenses and disrupts enemy energy formations instantly.</p>
          <span className="damaged">-20% Enemy Health</span>
        </div>

        <div className="move-card">
          <img src={meteor} alt="Meteor Drop" />
          <h2>Meteor Drop</h2>
          <p>Tears open a rift in spacetime that sucks opponents into a swirling maelstrom of cosmic fire and gravitational chaos.</p>
          <span className="damaged">-20% Enemy Health</span>
        </div>

        <div className="move-card">
          <img src={shield} alt="Earthquake Smash" />
          <h2>Earthquake Smash</h2>
          <p>Slams the ground with immense force, creating powerful seismic waves that destabilize opponents and the terrain.</p>
          <span className="damaged">-25% Enemy Health</span>
        </div>
      </div>

      {/* ===== Footer Text ===== */}
      <p className="moves-footer">
        Moves are more than power — they are the soul of every battle. Each
        strike carries a story, each defense a legacy of warriors.
      </p>
    </div>
  );
}