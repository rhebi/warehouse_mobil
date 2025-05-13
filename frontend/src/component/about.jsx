import React from "react";
import { Link } from "react-router-dom";
import "../css/about.css";
import about from "../img/about.jpg"

const About = () => {
  return (
    <div className="about-container">
      {/* Header */}
      <header className="about-header">
        <div className="about-logo">LOG</div>
        <nav className="about-navbar">
          <Link to="/home" className="about-nav-link">Home</Link>
          <Link to="/car" className="about-nav-link">Our Cars</Link>
          <Link to="/about" className="about-nav-link">About</Link>
          <Link to="/contact" className="about-nav-link">Contact</Link>
        </nav>
        <div className="about-manager">
          <Link to="/signup" className="about-manager-link">
            <img
              src="https://i.pinimg.com/474x/22/a3/33/22a33358af3ae57621d01aac0a01f8ae.jpg "
              alt="Manager Icon"
              className="about-manager-icon"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="about-section">
        <div className="about-image-container">
          <img src={about} alt="Bugatti Chiron"
            className="about-company-image"
          />
        </div>
        <div className="about-content">
          <h1 className="about-title">About Company</h1>
          <p className="about-tagline">Driven by Perfection, Designed for the Elite.</p>
          <p className="about-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, mollitia totam ipsa consequatur, ratione tenetur praesentium repudiandae labore quo rerum a at distinctio perferendis aut eaque dolor quos hic vel.
          </p>
          <Link to="/car" className="about-cta-link">
            <p className="about-cta">Explore Now.</p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p className="about-copyright">© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default About;