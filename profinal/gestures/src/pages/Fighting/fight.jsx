import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./fight.css";
import doctorStrange from "../../assets/images/docr.png";
import thanos from "../../assets/images/nosr.png";
import bgImage from "../../assets/images/blacky1.jpg";

import profiles from "../../assets/images/prostrange.jpg";
import profilet from "../../assets/images/prothanos.jpg";

const MOVE_VIDEOS = {
  // Player moves videos
  palm: "/videos/spell.mp4",
  fist: "/videos/varsha.mp4",
  index_up: "/videos/green.mp4",
  victory: "/videos/mirror.mp4",

  // Enemy moves videos
  meteor: "/videos/meteor.mp4",
  blast: "/videos/pinkbeam.mp4",
  quake: "/videos/earthquake.mp4",
  snap: "/videos/snap.mp4",
};

const PLAYER_MOVES = {
  palm: { id: "palm", label: "Spell Portal", damage: 15 },
  fist: { id: "fist", label: "Time Barrier", damage: 10 },
  index_up: { id: "index_up", label: "Mystic Bolt", damage: 20 },
  victory: { id: "victory", label: "Mirror Slash", damage: 35 },
};

const ENEMY_MOVES = {
  meteor: { id: "meteor", label: "Meteor Drop", damage: 20 },
  blast: { id: "blast", label: "Power Blast", damage: 18 },
  quake: { id: "quake", label: "Earthquake Smash", damage: 25 },
  snap: { id: "snap", label: "Snap", damage: 35 },
};

export default function BattleGame() {
  const navigate = useNavigate();

  // All states in proper order
  const [showPlayerInfo, setShowPlayerInfo] = useState(false);
  const [showEnemyInfo, setShowEnemyInfo] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [message, setMessage] = useState("");
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [currentCharacter, setCurrentCharacter] = useState("strange");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [winnerMessage, setWinnerMessage] = useState(null);
  const [showEndingVideo, setShowEndingVideo] = useState(false);

  const socketRef = useRef(null);
  const gestureBlocked = useRef(false);
  const videoRef = useRef(null);
  const endingVideoRef = useRef(null);

  // Video end handler for ending video
  const handleVideoEnd = () => {
    navigate("/");
  };

  // Video skip ke liye keyboard handler
  useEffect(() => {
    if (showEndingVideo) {
      const handleKey = (e) => {
        if (e.key === "q" || e.key === "Q") {
          navigate("/");
        }
      };

      window.addEventListener("keydown", handleKey);

      return () => {
        window.removeEventListener("keydown", handleKey);
      };
    }
  }, [showEndingVideo, navigate]);

  // WebSocket connection
  useEffect(() => {
    const connect = () => {
      console.log("Connecting...");
      const ws = new WebSocket("ws://localhost:8765");
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("Connected!");
        if (!gameActive) {
          setMessage("Press ENTER to fight!");
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Server:", data);

          if (data.type === "gesture") {
            if (!gameActive || !playerTurn) return;
            if (gestureBlocked.current) return;

            gestureBlocked.current = true;
            handlePlayerMove(data.label);
          } else if (data.type === "thanos_action") {
            if (!gameActive || playerTurn) return;

            const move = data.action;
            const damage = move.damage || ENEMY_MOVES[move.id]?.damage || 0;

            showMoveAnimation(move.label, () => {
              setPlayerHP((hp) => {
                const newHP = Math.max(0, hp - damage);
                if (newHP <= 0) endGame("Thanos");
                return newHP;
              });

              if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(
                  JSON.stringify({
                    type: "reward",
                    action_id: move.id,
                    delta: damage,
                  })
                );
              }

              setTimeout(() => {
                setPlayerTurn(true);
                gestureBlocked.current = false;
                setMessage("Your turn - Show a gesture!");
              }, 1000);
            });
          }
        } catch (err) {
          console.error("Message error:", err);
        }
      };

      ws.onclose = () => {
        console.log("Disconnected");
        setMessage("Reconnecting...");
        setTimeout(connect, 2000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [gameActive, playerTurn]);

  // Video end handler
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleVideoEnd = () => {
        setCurrentVideo(null);
      };

      videoElement.addEventListener("ended", handleVideoEnd);
      return () => videoElement.removeEventListener("ended", handleVideoEnd);
    }
  }, [currentVideo]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter" && !gameActive) startGame();
      else if (e.key === "q" || e.key === "Q") navigate("/");
      else if (e.key === "t" || e.key === "T") toggleCharacter();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameActive, navigate]);

  const toggleCharacter = () => {
    setCurrentCharacter((prev) => (prev === "strange" ? "thanos" : "strange"));
    setMessage(
      `Turn shifted to ${
        currentCharacter === "strange" ? "Thanos" : "Doctor Strange"
      }!`
    );
  };

  const startGame = () => {
    setGameActive(true);
    setPlayerTurn(true);
    gestureBlocked.current = false;
    setMessage("Your turn - Show a gesture!");
    console.log("Game started!");
  };

  const handlePlayerMove = (gesture) => {
    if (!gameActive || !playerTurn) return;

    const move = PLAYER_MOVES[gesture];
    if (!move) return;

    console.log("Player used:", move.label);

    // Play player move video
    if (MOVE_VIDEOS[gesture]) {
      setCurrentVideo(MOVE_VIDEOS[gesture]);
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "player_action",
          action: move.id,
        })
      );
    }

    showMoveAnimation(`${move.label}`, () => {
      // ✅ FUNCTIONAL UPDATE USE KARO - ye latest state lega
      setEnemyHP((currentHP) => {
        const newHP = Math.max(0, currentHP - move.damage);

        if (newHP <= 0) {
          // ✅ Enemy mar gaya
          setTimeout(() => {
            endGame("Doctor Strange");
          }, 100);
          return newHP;
        }

        // ✅ Agar enemy zinda hai to aage ka code chale
        setTimeout(() => {
          setPlayerTurn(false);
          setMessage("Thanos thinking...");

          setTimeout(() => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
              socketRef.current.send(
                JSON.stringify({ type: "request_thanos" })
              );
              setMessage("Thanos attacking...");
            }
          }, 2000);
        }, 100);

        return newHP;
      });
    });
  };

  const showMoveAnimation = (moveText, onFinish) => {
    console.log("Move animation:", moveText);
    setMessage(moveText);

    // Enemy move video play
    if (!playerTurn) {
      const enemyMove = Object.keys(ENEMY_MOVES).find(
        (key) => ENEMY_MOVES[key].label === moveText
      );
      if (enemyMove && MOVE_VIDEOS[enemyMove]) {
        setCurrentVideo(MOVE_VIDEOS[enemyMove]);
      }
    }

    setTimeout(() => {
      onFinish();
    }, 1500);
  };

  // Directly `endGame` function shuru karo:
  const endGame = (winner) => {
    // Set winner message based on who won
    if (winner === "Doctor Strange") {
      setWinnerMessage("Dr. Strange wins! Entire world is saved...");

      // Strange ke liye sirf message
      setTimeout(() => {
        setWinnerMessage(null);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }, 4000);
    } else if (winner === "Thanos") {
      setWinnerMessage(
        "Thanos wins! Now Iron Man has to come to save the world..."
      );

      // Thanos ke liye: message dikhao, phir video play karo
      setTimeout(() => {
        setWinnerMessage(null);
        setShowEndingVideo(true); // ✅ Video start karo
      }, 2000); // 2 seconds message dikhao
    }
  };

  return (
    <div
      className="character-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* ✅ Ending Video (Thanos win ke liye) */}
      {showEndingVideo && (
        <div className="ending-video-overlay">
          <video
            ref={endingVideoRef}
            autoPlay
            className="ending-video"
            onEnded={handleVideoEnd}
          >
            <source src="/videos/snapfinalvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-skip-text">Press Q to quit</div>
        </div>
      )}
      {/* Winner Message Popup */}
      {winnerMessage && !showEndingVideo && (
        <div className="winner-popup">
          <div className="winner-message">{winnerMessage}</div>
        </div>
      )}

      {/* Video Player */}
      {currentVideo && (
        <div className="move-video-container">
          <video ref={videoRef} autoPlay muted className="move-video">
            <source src={currentVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Blur overlay when game is not active */}
      {!gameActive && <div className="blur-overlay"></div>}

      {/* Start screen message */}
      {!gameActive && (
        <div className="start-screen">
          <div className="start-title">Gesture Battle</div>
          <div className="start-message">Press ENTER to fight!</div>
          <div className="start-submessage">Press Q to quit</div>
        </div>
      )}

      {/* Center message display */}
      {gameActive && <div className="status-overlay">{message}</div>}

      {/* Player side */}
      <div className="power-status left-status">
        <div
          className="profile-icon"
          onClick={() => setShowPlayerInfo(!showPlayerInfo)}
        >
          <img src={profiles} alt="Doctor Strange" />
        </div>

        <div className="bar">
          <div className="fill strange" style={{ width: `${playerHP}%` }} />
        </div>

        <span className="percent">{playerHP}%</span>

        {showPlayerInfo && (
          <div className="info-box left-info">
            <h4>Doctor Strange</h4>
            <ul>
              <li>✋ Palm – Spell Portal (−15)</li>
              <li>✊ Fist – Time Barrier (−10)</li>
              <li>👆 Index Up – Mystic Bolt (−20)</li>
              <li>✌ Victory – Mirror Slash (−35)</li>
            </ul>
          </div>
        )}
      </div>

      {/* Enemy side */}
      <div className="power-status right-status">
        <div
          className="profile-icon"
          onClick={() => setShowEnemyInfo(!showEnemyInfo)}
        >
          <img src={profilet} alt="Thanos" />
        </div>

        <div className="bar">
          <div className="fill thanos" style={{ width: `${enemyHP}%` }} />
        </div>

        <span className="percent">{enemyHP}%</span>

        {showEnemyInfo && (
          <div className="info-box right-info">
            <h4>Thanos</h4>
            <ul>
              <li>☄️ Meteor Drop (−20)</li>
              <li>💥 Power Blast (−18)</li>
              <li>🌋 Earthquake Smash (−25)</li>
              <li>🫰 Snap (−35)</li>
            </ul>
          </div>
        )}
      </div>

      {/* Characters */}
      <div className="character left">
        <img src={doctorStrange} alt="Doctor Strange" />
      </div>

      <div className="character right">
        <img src={thanos} alt="Thanos" />
      </div>

      {/* Turn indicator */}
      {gameActive && (
        <div className="turn-indicator">
          Current:{" "}
          {currentCharacter === "strange" ? "Doctor Strange" : "Thanos"}
          <br />
          <small>Press 'T' to switch</small>
        </div>
      )}
    </div>
  );
}
