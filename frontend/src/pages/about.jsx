import React from "react";
import { Link } from "react-router-dom";
import "../css/about.css";
import { useAuth } from "../context/AuthContext.jsx"; 

const About = () => {
  const { user, logout } = useAuth(); 
  const userRole = user?.role || "";

  return (
    <div className="about-container">
      <section className="about-section">
        <div className="about-image-container">
          <img src="/img/about.jpg" alt="Bugatti Chiron" className="about-company-image" />
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

      <footer className="about-footer">
        <p>© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default About;
