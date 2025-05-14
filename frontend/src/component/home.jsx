import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";
import chiron from "../img/chiron.jpg";

const Home = () => {
  // Baca data user dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || ""; // Default ke string kosong jika tidak ada

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Hapus data user
    window.location.reload(); // Reload halaman agar role hilang
  };

  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden font-[Poppins]">
      {/* Header */}
      <header className="header flex justify-between items-center px-8 py-4 bg-black/90">
        <div className="logo text-2xl font-bold italic text-white">LOG</div>

        <nav className="navbar absolute left-1/2 transform -translate-x-1/2 flex space-x-10">
          <Link to="/" className="text-white text-lg font-medium hover:text-white">
            Home
          </Link>
          <Link to="/car" className="text-white text-lg font-medium hover:text-white">
            Our Cars
          </Link>
          <Link to="/about" className="text-white text-lg font-medium hover:text-white">
            About
          </Link>
          <Link to="/contact" className="text-white text-lg font-medium hover:text-white">
            Contact
          </Link>
        </nav>

        <div className="manager flex items-center gap-2">
          {/* Jika user belum login, tampilkan link ke signup */}
          {!user && (
            <Link to="/signup" className="flex items-center gap-2 text-white">
              <img
                src="https://i.pinimg.com/474x/22/a3/33/22a33358af3ae57621d01aac0a01f8ae.jpg "
                alt="Manager Icon"
                className="manager-icon w-10 h-10 rounded-full"
              />
            </Link>
          )}

          {/* Jika user sudah login, tampilkan role dan tombol logout */}
          {user && (
            <>
              <img
                src="https://i.pinimg.com/474x/22/a3/33/22a33358af3ae57621d01aac0a01f8ae.jpg "
                alt="Manager Icon"
                className="manager-icon w-10 h-10 rounded-full cursor-pointer"
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

      {/* Main Container */}
      <div className="main-container">
        {/* Hero Section */}
        <section className="hero-section relative w-full h-screen overflow-hidden">
          <img
            src={chiron}
            alt="Bugatti Chiron"
            className="w-full h-full object-cover"
          />
          <div className="overlay absolute top-0 left-0 w-full h-full flex flex-col justify-between items-start px-10 py-10 bg-black/60">
            <h1 className="text-4xl italic font-semibold text-white">The Future Of Luxury</h1>
            <p className="text-3xl italic font-medium text-white self-end mt-auto">Driving and Fast</p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer bg-black/90 text-center py-2 fixed bottom-0 left-0 w-full z-10">
        <p className="copyright text-xs text-white">© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default Home;