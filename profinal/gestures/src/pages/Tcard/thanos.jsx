import React from "react";
import "../DocCard/doc.css"; // same styling
import thanos from "../../assets/images/tcard.gif"; 
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ThanosCard() {
  const navigate = useNavigate();

  return (
    <div className="card-wrapper">
      {/* Left arrow → back to Doctor Strange card */}
      <div className="arrow-btn left" onClick={() => navigate("/doc")}>
        <ChevronLeft size={40} />
      </div>

      {/* Right arrow (optional future card) */}
      <div className="arrow-btn right" onClick={() => navigate("/powers")}>
        <ChevronRight size={40} />
      </div>

      {/* Character section */}
      <div className="character-card">
        <div className="character-image">
          <img src={thanos} alt="Thanos" />
        </div>
        <div className="character-info">
          <h1 className="name">THANOS</h1>
          <h3 className="rarity">Mythic</h3>
          <p className="description">
            Born on the planet Titan, Thanos possesses unmatched strength and
            intellect. Obsessed with balance in the universe, he seeks the
            Infinity Stones to wipe out half of all life. A master strategist
            and ruthless warlord, he believes his purpose is destiny itself.
          </p>
        </div>
      </div>

    </div>
  );
}