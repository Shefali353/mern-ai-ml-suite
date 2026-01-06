import React from "react";
import "./doc.css";
import doctorStrange from "../../assets/images/dcard.gif";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorStrangeCard() {
  const navigate = useNavigate();

  return (
    <div className="card-wrapper">
      {/* Left arrow → goes back to Story page */}
      <div className="arrow-btn left" onClick={() => navigate("/story")}>
        <ChevronLeft size={40} />
      </div>

      {/* Right arrow → goes to Thanos card */}
      <div className="arrow-btn right" onClick={() => navigate("/thanos")}>
        <ChevronRight size={40} />
      </div>

      {/* Character section */}
      <div className="character-card">
        <div className="character-image">
          <img src={doctorStrange} alt="Doctor Strange" />
        </div>
        <div className="character-info">
          <h1 className="name">DOCTOR STRANGE</h1>
          <h3 className="rarity">Legendary</h3>
          <p className="description">
            Once a brilliant but arrogant neurosurgeon, Stephen Strange's life
            changed forever after a car accident robbed him of the use of his
            hands. Seeking healing, he discovered the hidden world of magic and
            alternate dimensions, becoming the Sorcerer Supreme — protector of
            the multiverse.
          </p>
        </div>
      </div>

      
    </div>
  );
}