import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";
import chiron from "../img/chiron.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden font-[Poppins]">
      {/* Header */}
      <header className="header">
        <div className="logo">LOG</div>
        <nav className="navbar">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/car" className="nav-link">Our Cars</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
        <div className="manager">
          <Link to="/signup" className="manager-link">
            <img
              src="https://i.pinimg.com/474x/22/a3/33/22a33358af3ae57621d01aac0a01f8ae.jpg "
              alt="Manager Icon"
              className="manager-icon"
            />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="main-container">
        {/* Hero Section */}
        <section className="hero-section">
          <img src={chiron} alt="Bugatti Chiron" className="hero-image" />
          <div className="overlay">
            <h1 className="tagline">The Future Of Luxury</h1>
            <p className="slogan">Driving and Fast</p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="copyright">© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default Home;