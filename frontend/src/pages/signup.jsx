import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Mengimpor hook untuk navigasi dan komponen Link
import '../css/signup.css'; // Mengimpor file CSS khusus untuk halaman signup
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Mengimpor ikon mata untuk toggle password
import axios from "../api/axios"; // Mengimpor instance Axios yang sudah dikonfigurasi

const Signup = () => {
  // State untuk menyimpan nilai input form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState(""); // Konfirmasi password
  // State untuk mengontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [msg, setMsg] = useState(""); // State untuk pesan error
  const navigate = useNavigate(); // Hook untuk navigasi halaman

  // Fungsi untuk menangani proses signup saat form disubmit
  const handleSignup = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    try {
      // Mengirim request POST ke endpoint /users (untuk mendaftar user baru)
      await axios.post("/users", {
        name,
        email,
        password,
        confpassword: confPassword // Kirim konfirmasi password ke backend
      });
      navigate("/login"); // Jika sukses, arahkan user ke halaman login
    } catch (err) {
      // Menampilkan pesan error dari backend atau pesan default jika signup gagal
      setMsg(err.response?.data?.msg || "Signup gagal");
    }
  };

  return (
    // Struktur utama halaman signup
    <div className="signup-container">
      {/* Bagian header signup */}
      <header className="signup-header">
        <h1 className="signup-logo">LOG</h1> {/* Logo aplikasi */}
        <h2 className="signup-title">Sign Up</h2> {/* Judul halaman */}
      </header>

      {/* Bagian utama form signup */}
      <main className="signup-main">
        <form className="signup-form" onSubmit={handleSignup}>
          {msg && <p className="text-red-500 text-sm mb-3">{msg}</p>} {/* Menampilkan pesan error */}

          {/* Input field Nama */}
          <div className="signup-field">
            <label htmlFor="name" className="signup-label">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="signup-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required // Wajib diisi
            />
          </div>

          {/* Input field Email */}
          <div className="signup-field">
            <label htmlFor="email" className="signup-label">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // Wajib diisi
            />
          </div>

          {/* Input field Password dengan toggle visibilitas */}
          <div className="signup-field relative">
            <label htmlFor="password" className="signup-label">Password</label>
            <input
              type={showPassword ? "text" : "password"} // Tipe input berubah
              id="password"
              placeholder="Enter your password"
              className="signup-input pr-10" // pr-10 untuk ruang ikon
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // Wajib diisi
            />
            {/* Tombol toggle visibilitas password */}
            <span
              className="signup-toggle"
              onClick={() => setShowPassword((prev) => !prev)} // Mengubah state showPassword
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Ikon mata */}
            </span>
          </div>

          {/* Input field Konfirmasi Password dengan toggle visibilitas */}
          <div className="signup-field relative">
            <label htmlFor="confPassword" className="signup-label">Confirm Password</label>
            <input
              type={showConfPassword ? "text" : "password"} // Tipe input berubah
              id="confPassword"
              placeholder="Confirm your password"
              className="signup-input pr-10" // pr-10 untuk ruang ikon
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required // Wajib diisi
            />
            {/* Tombol toggle visibilitas konfirmasi password */}
            <span
              className="signup-toggle"
              onClick={() => setShowConfPassword((prev) => !prev)} // Mengubah state showConfPassword
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)'
              }}
            >
              {showConfPassword ? <FaEyeSlash /> : <FaEye />} {/* Ikon mata */}
            </span>
          </div>

          {/* Tombol untuk submit form signup */}
          <button type="submit" className="signup-button mt-4">
            Create Account
          </button>

          {/* Link ke halaman login jika sudah punya akun */}
          <p className="mt-4 text-center">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">login</Link>
          </p>
        </form>
      </main>

      {/* Bagian footer halaman signup */}
      <footer className="signup-footer">
        <p>© 2025 Ronaldo Luxury Car</p> {/* Informasi copyright */}
      </footer>
    </div>
  );
};

export default Signup; // Mengekspor komponen Signup