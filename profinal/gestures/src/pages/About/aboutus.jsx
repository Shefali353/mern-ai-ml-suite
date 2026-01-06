import React from "react";
import "./aboutus.css";
import mentor from "../../assets/images/rsir.jpg";
import coordinator from "../../assets/images/bbsir.jpg";
import shefali from "../../assets/images/spic.jpg";
import anshika from "../../assets/images/apic.jpg";
import banner from "../../assets/images/aboutusbg.jpg";

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* 🔹 Exit Button */}
      <div className="exit-button">
        <a href="/MainPage">Exit</a>
      </div>

      {/* 🔹 Top Banner */}
      <div className="banner">
        <img src={banner} alt="About Project" />
        <div className="banner-text">
          <h1>About Our Project</h1>
          <p>"Redefining Interaction with Touchless Control"</p>
        </div>
      </div>

      {/* 🔹 Project Overview Section */}
      <section className="project-overview">
        <h2>Project Overview</h2>
        <p>
          Our project <strong>“Navi Mouse”</strong> is a smart touchless control
          system that redefines human-computer interaction through gestures,
          facial recognition, and intelligent automation. Using{" "}
          <strong>Python</strong>, <strong>OpenCV</strong>, and several other
          supporting <strong>AI/ML libraries and custom-trained models</strong>,
          we built a system capable of accurately detecting and responding to
          hand gestures for controlling the computer — eliminating the need for
          physical devices like a mouse.
        </p>

        <p>
          The project also features an advanced module called{" "}
          <strong>“SignVerse”</strong>, which uses{" "}
          <strong>ASL sign recognition</strong> powered by live
          camera input to recognize 10–11 signs and provide
          <strong> audio feedback</strong> describing the action. With appropriate hardware, <strong>SignVerse</strong>{" "}
          can be fully developed into a comprehensive sign language recognizer.

        </p>
        <p>
          Additionally, our team designed a gesture-controlled game called{" "}
          <strong>“Shadow of Sacrifice”</strong> powered by an AI agent that
          learns through reinforcement — competing against the user's real-time
          gestures. This demonstrates the potential of integrating{" "}
          <strong>AI learning</strong> with human-controlled environments for
          entertainment and innovation.
        </p>
      </section>

      {/* 🔹 Developers Section */}
      <section className="developers">
        <h2>Meet the Developers</h2>
        <div className="developer-grid">
          <div className="profile-card">
            <img
              src={shefali}
              alt="Shefali Qureshi"
              className="profile-photo"
            />
            <h3>Shefali Qureshi</h3>
            <p className="role">Backend Developer</p>
            <p className="desc">
              Focused on developing the Python backend, I implemented OpenCV and
              MediaPipe modules for gesture and emotion detection. My main goal
              was to create smooth, accurate, and real-time recognition
              pipelines for reliable system control.
            </p>
          </div>

          <div className="profile-card">
            <img
              src={anshika}
              alt="Anshika Chauhan"
              className="profile-photo"
            />
            <h3>Anshika Chauhan</h3>
            <p className="role">Frontend Developer</p>
            <p className="desc">
              Responsible for designing the user interface — ensuring a clean,
              modern, and interactive experience. Worked closely on the visual
              structure and integration with backend modules for seamless
              real-time interaction.
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 Mentor & Coordinator Section */}
      <section className="mentors">
        <h2>Our Guides</h2>
        <div className="mentor-grid">
          <div className="mentor-box">
            <img
              src={mentor}
              alt="Er. Bhaskar Bhardwaj"
              className="mentor-photo"
            />
            <div>
              <h3>Er. Bhaskar Bhardwaj</h3>
              <p className="role">Project Mentor</p>
              <p>
                Guided us through every phase — from concept to completion. His
                valuable insights helped us improve algorithm performance and
                achieve real-time responsiveness.
              </p>
            </div>
          </div>

          <div className="mentor-box">
            <img
              src={coordinator}
              alt="Er. Rajeev Thakur"
              className="mentor-photo"
            />
            <div>
              <h3>Er. Rajeev Thakur</h3>
              <p className="role">Project Coordinator</p>
              <p>
                Provided strong academic and moral guidance, ensuring the
                project remained on track and aligned with innovation,
                creativity, and teamwork.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
