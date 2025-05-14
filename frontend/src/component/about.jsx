import React from "react";
import { Link } from "react-router-dom";
import "../css/about.css";
import about from "../img/about.jpg";

const About = () => {
  // Baca data user dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || ""; // Default ke string kosong jika tidak ada

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Hapus data user
    window.location.reload(); // Reload halaman agar role hilang
  };

  return (
    <div className="about-container">
      {/* Header */}
      <header className="about-header">
        <div className="about-logo">LOG</div>
        <nav className="about-navbar">
          <Link to="/" className="about-nav-link">Home</Link>
          <Link to="/car" className="about-nav-link">Our Cars</Link>
          <Link to="/about" className="about-nav-link">About</Link>
          <Link to="/contact" className="about-nav-link">Contact</Link>
        </nav>
        <div className="about-manager flex items-center gap-2">
          {/* Jika user belum login, tampilkan link ke signup */}
          {!user && (
            <Link to="/signup" className="flex items-center gap-2 text-white">
              <img
                src="https://i.pinimg.com/474x/22/a3/33/22a33358af3ae57621d01aac0a01f8ae.jpg "
                alt="Manager Icon"
                className="about-manager-icon w-10 h-10 rounded-full"
              />
            </Link>
          )}

          {/* Jika user sudah login, tampilkan role dan tombol logout */}
          {user && (
            <>
              <img
                src="https://i.pinimg.com/474x/22/a3/33/22a33358af3ae57621d01aac0a01f8ae.jpg "
                alt="Manager Icon"
                className="about-manager-icon w-10 h-10 rounded-full cursor-pointer"
              />

              {/* Tampilkan role di samping icon */}
              <span className="role-text text-white text-sm font-medium">{userRole}</span>

              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                className="ml-2 text-xs text-gray-300 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <section className="about-section">
        <div className="about-image-container">
          <img src={about} alt="Bugatti Chiron" className="about-company-image" />
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