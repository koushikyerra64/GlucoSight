import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Predict from "./pages/Predict";
import Performance from "./pages/Performance";
import Dashboard from "./pages/Dashboard";
import Awareness from "./pages/Awareness";
import Contact from "./pages/Contact";

import "./App.css";

export default function App() {
  return (
    <div className="App">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}