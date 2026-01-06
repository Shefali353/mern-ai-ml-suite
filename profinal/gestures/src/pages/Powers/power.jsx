import React from "react";
import "./power.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import powerblast from "../../assets/images/powerblast.jpg";
import snap from "../../assets/images/snap.jpg";
import repulsor from "../../assets/images/repulsorblast.jpg";

export default function Powers() {
  const navigate = useNavigate();

  return (
    <div className="moves-container">
      {/* ===== Arrows ===== */}
      <button className="arrow-btn left" onClick={() => navigate("/thanos")}>
        <ChevronLeft size={40} />
      </button>

      {/* ✅ FIXED: Right arrow goes to moves page */}
      <button className="arrow-btn right" onClick={() => navigate("/moves")}>
        <ChevronRight size={40} />
      </button>

      {/* ===== Title ===== */}
      <h1 className="moves-title">WONDERS OF MOVES</h1>

      {/* ===== Cards Section ===== */}
      <div className="moves-grid">
        <div className="move-card">
          <img src={powerblast} alt="Power Blast" />
          <h2>Power Blast</h2>
          <p>A devastating beam of concentrated cosmic force that obliterates everything in its path with unimaginable power.</p>
          <span className="damaged">-18% Enemy Health</span>
        </div>

        <div className="move-card">
          <img src={snap} alt="Snap" />
          <h2>Snap</h2>
          <p>The legendary finger snap that instantly erases half of all opposing forces from existence, regardless of their defenses.</p>
          <span className="damaged">-35% Enemy Health</span>
        </div>

        <div className="move-card">
          <img src={repulsor} alt="Repulsor Blast" />
          <h2>Repulsor Blast</h2>
          <p>Precision energy bolts fired from palm gauntlets that strike with surgical accuracy and overwhelming force.</p>
          <span className="damaged">-100% Enemy Health</span>
        </div>
      </div>

      {/* ===== Footer Text ===== */}
      <p className="moves-footer">
        Every move shapes destiny. The strongest ones can end a battle in a single strike.
      </p>
    </div>
  );
}