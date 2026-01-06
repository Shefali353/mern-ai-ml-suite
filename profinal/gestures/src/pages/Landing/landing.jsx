import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import bgImage from "../../assets/images/landingfinal.jpg";
import bgMusic from "../../assets/sounds/music.wav";

export default function Landing() {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const words = ["Shadow", "of", "Sacrifice"];

  const audioRef = useRef(null);
  const hasPressedRef = useRef(false);
  const showOptionsRef = useRef(false);
  const timeoutsRef = useRef([]);
  const animationStartedRef = useRef(false);

  // initialize audio once
  useEffect(() => {
    audioRef.current = new Audio(bgMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;

    // Start-handler: waits for first user interaction
    const startHandler = (e) => {
      if (!started && !animationStartedRef.current) {
        animationStartedRef.current = true;
        // mark started before calling startAnimation so re-renders don't duplicate
        setStarted(true);

        // try to play (browser may allow because this was triggered by user key)
        audioRef.current
          .play()
          .then(() => console.log("🎵 Music playing..."))
          .catch((err) =>
            console.log("Autoplay/play blocked or error:", err?.message || err)
          );

        startAnimation();
      }
    };

    window.addEventListener("keydown", startHandler);

    return () => {
      window.removeEventListener("keydown", startHandler);
      // cleanup timeouts and pause audio
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      audioRef.current && audioRef.current.pause();
    };
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const startAnimation = () => {
    
    const initialDelay = setTimeout(() => {
      
      words.forEach((word, index) => {
        const t = setTimeout(() => {
          setDisplayText((prev) => prev + (prev ? " " : "") + word);
        }, index * 2000); 
      });

      
      const t2 = setTimeout(() => {
        setShowOptions(true);
        showOptionsRef.current = true;
        
        setupFinalKeyHandler();
      }, 10000); 
      timeoutsRef.current.push(t2);
    }, 700); 

    timeoutsRef.current.push(initialDelay);
  };

  // Setup key handler only when options are visible
  const setupFinalKeyHandler = () => {
    const handleKeys = (e) => {
      if (hasPressedRef.current) return; // already handled one final action

      const key = e.key;
      if (key.toLowerCase() === "q") {
        hasPressedRef.current = true;
        try {
          audioRef.current && audioRef.current.pause();
        } catch (err) {}
        console.log("❌ Exiting game...");
        // Navigate to landing page instead of closing window
        navigate("/");
      } else if (key === "Enter") {
        hasPressedRef.current = true;
        try {
          audioRef.current && audioRef.current.pause();
        } catch (err) {}
        console.log("➡ Proceeding to Story page");
        // Navigate to Story page
        navigate("/story");
      }
    };

    window.addEventListener("keydown", handleKeys);

    // Store cleanup function
    const cleanup = () => window.removeEventListener("keydown", handleKeys);
    timeoutsRef.current.push(cleanup);
  };

  // keep showOptionsRef in sync with state (helps if some other code changes state)
  useEffect(() => {
    showOptionsRef.current = showOptions;
  }, [showOptions]);

  return (
    <div
      className="landing-container"
      style={{ backgroundImage: `url(${bgImage})` }}
      role="main"
    >
      {!started && (
        <div className="press-start" aria-hidden>
          <p>Press any key to begin...</p>
        </div>
      )}

      {started && (
        <>
          <h1 className="landing-text">{displayText}</h1>
          {showOptions && (
            <div className="landing-popup" role="dialog" aria-label="options">
              <p>
                Press <span className="highlight">Enter</span> to Continue
              </p>
              <p>
                Press <span className="highlight">Q</span> to Exit
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
