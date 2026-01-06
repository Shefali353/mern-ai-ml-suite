import React from "react";
import "../DocCard/doc.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import story from "../../assets/images/story.gif";

export default function Story() {
  const navigate = useNavigate();

  return (
    <div className="card-wrapper">
      {/* Left arrow (go back to landing) */}
      <div className="arrow-btn left" onClick={() => navigate("/landing")}>
        <ChevronLeft size={40} />
      </div>

      {/* Right arrow → Goes to Doctor Strange Page */}
      <div className="arrow-btn right" onClick={() => navigate("/doc")}>
        <ChevronRight size={40} />
      </div>

      {/* Main Story Section */}
      <div className="character-card">
        {/* Left: Image */}
        <div className="character-image">
          <img src={story} alt="Actual Story" />
        </div>

        {/* Right: Story Info */}
        <div className="character-info">
          <h1 className="name">THE COSMIC INVASION</h1>
          <h3 className="rarity">The Hunt for the Infinity Stones</h3>

          <p className="description">
            Across the endless galaxies, <strong>Thanos</strong> — the tyrant of{" "}
            <strong>Titan Planet</strong> — began his ultimate quest to collect the{" "}
            <strong>Infinity Stones</strong>, ancient cosmic crystals that control
            the very fabric of reality, time, and life itself.
          </p>

          <p className="description">
            His arrival on <strong>Earth</strong> was no accident. The final stones
            were hidden here — one guarded within the{" "}
            <strong>Sanctum Sanctorum</strong> by <strong>Doctor Strange</strong>, and
            another embedded within <strong>Vision's</strong> forehead. As Thanos
            descended upon <strong>New York City</strong>, chaos tore through the
            skies.
          </p>

          <p className="description">
            <strong>Iron Man</strong>, <strong>Spider-Man</strong>, and{" "}
            <strong>Doctor Strange</strong> stood as the city's first line of
            defense, uniting against the most powerful being the universe had
            ever seen. But every battle pushed them closer to an impossible
            truth — <em>fate was never in their favor.</em>
          </p>
        </div>
      </div>

    </div>
  );
}