import React from "react";
import "../Powers/power.css";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import mirror from "../../assets/images/mirrorslash.jpg";
import barrier from "../../assets/images/timebarrier.jpg";
import portal from "../../assets/images/portal.jpg";

export default function Strength() {
  const navigate = useNavigate();

  return (
    <div className="moves-container">
      {/* ===== Arrows ===== */}
      <button className="arrow-btn left" onClick={() => navigate("/moves")}>
        <ChevronLeft size={40} />
      </button>

      <button className="arrow-btn right" onClick={() => navigate("/fight")}>
        <ChevronRight size={40} />
      </button>

      {/* ===== Title ===== */}
      <h1 className="moves-title">WONDERS OF MOVES</h1>

      {/* ===== Cards Section ===== */}
      <div className="moves-grid">
        {/* --- Card 1 --- */}
        <div className="move-card">
          <img src={mirror} alt="Mirror Slash" />
          <h2>Mirror Slash</h2>
          <p>A precision strike that shatters deceptive illusions and reveals hidden enemies by cutting through dimensional veils.</p>
          <span className="damaged">-35% Enemy Health</span>
        </div>

        {/* --- Card 2 --- */}
        <div className="move-card">
          <img src={barrier} alt="Time Barrier" />
          <h2>Time Barrier</h2>
          <p>Slams the ground with immense force, creating powerful seismic waves that destabilize opponents and the terrain.</p>
          <span className="damaged">-10% Enemy Health</span>
        </div>

        {/* --- Card 3 --- */}
        <div className="move-card">
          <img src={portal} alt="Spell Portal" />
          <h2>Spell Portal</h2>
          <p>Summons a massive celestial rock from orbit that crashes down with explosive force and intense heat.</p>
          <span className="damaged">-15% Enemy Health</span>
        </div>
      </div>

      {/* ===== Footer Text ===== */}
      <p className="moves-footer">
        Moves are forces of nature and mysticism. Each strike alters the flow of
        combat, unleashing power beyond imagination.
      </p>
    </div>
  );
}