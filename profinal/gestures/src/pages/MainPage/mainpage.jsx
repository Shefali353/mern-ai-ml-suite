import React from "react";
import { useNavigate } from "react-router-dom";
import "./mainpage.css";

const MainPage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Shadow of Sacrifice",
      desc: "Gesture-controlled Marvel fighting game where users compete with AI agents in dynamic combat.",
      path: "/landing",
      video: "/gamy.mp4",
    },
    {
      title: "Navi Mouse",
      desc: "Virtual mouse controlled by hand gestures, voice commands, and eye tracking for seamless navigation.",
      path: "/vmouse",
      video: "/mousy.mp4",
    },
    {
      title: "Sign Verse", 
      desc: "Real-time sign language detection that converts gestures into text and voice output for communication.",
      path: "/signhome",
      video: "/sighny.mp4",
    },
    {
      title: "About Us",
      desc: "Meet our development team and guides behind these innovative gesture-controlled technologies.",
      path: "/aboutus",
      video: "/abouty.mp4",
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="main-container">
      {/* ==== ADDED: GESTRON HEADING ==== */}
      <h1 className="page-heading">GESTURON</h1>
      
      <div className="card-container">
        {cards.map((card, index) => (
          <div
            className="card"
            key={index}
            onClick={() => handleCardClick(card.path)}
            style={{ cursor: "pointer" }}
          >
            {/* ==== VIDEO PREVIEW HERE ==== */}
            <div className="card-img">
              <video
                src={card.video}
                autoPlay
                loop
                muted
                playsInline
                className="video-preview"
              />
            </div>

            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;