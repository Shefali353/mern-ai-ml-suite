import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/mainpage";
import Landing from "./pages/Landing/landing";
import Vmouse from "./pages/Vmouse/mouse";
import SignHome from "./pages/SignHome/home";
import AboutUs from "./pages/About/aboutus";
import Story from "./pages/Story/story";
import DocCard from "./pages/DocCard/doc";
import Tcard from "./pages/Tcard/thanos";
import Powers from "./pages/Powers/power";
import Moves from "./pages/Moves/move";
import Strengths from "./pages/Strengths/strength";
import Fighting from "./pages/Fighting/fight";
import VMFeatures from "./pages/VMFeatures/vm";
import SignFeatures from "./pages/SignFeatures/features";
import SignDemo from "./pages/SignDemo/demo";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/vmouse" element={<Vmouse />} />
          <Route path="/Vmouse" element={<Vmouse />} />
          <Route path="/SignHome" element={<SignHome />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/story" element={<Story />} />
          <Route path="/doc" element={<DocCard />} />
          <Route path="/thanos" element={<Tcard />} />
          <Route path="/powers" element={<Powers />} />
          <Route path="/moves" element={<Moves />} />
          <Route path="/strengths" element={<Strengths />} />
          <Route path="/fight" element={<Fighting />} />
          <Route path="/VMFeatures" element={<VMFeatures />} />
          <Route path="/MainPage" element={<MainPage />} />
          <Route path="/SignFeatures" element={<SignFeatures />} />
          <Route path="/SignDemo" element={<SignDemo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;