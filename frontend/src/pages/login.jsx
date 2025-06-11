import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/login.css"; // Mengimpor file CSS khusus untuk halaman login
import axios from "../api/axios"; // Mengimpor instance Axios yang sudah dikonfigurasi
import { useAuth } from "../context/AuthContext"; // Mengimpor hook untuk mengelola state otentikasi user
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Mengimpor ikon mata untuk toggle password

const Login = () => {
  const { setUser } = useAuth(); // Mengambil fungsi setUser dari AuthContext untuk menyimpan data user yang login
  const [email, setEmail] = useState(""); // State untuk menyimpan input email
  const [password, setPassword] = useState(""); // State untuk menyimpan input password
  const [msg, setMsg] = useState(""); // State untuk menyimpan pesan error atau sukses
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle visibilitas password
  const navigate = useNavigate(); // Hook untuk navigasi halaman

  // Fungsi untuk menangani proses login saat form disubmit
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman saat form disubmit
    try {
      // Mengirim request POST ke endpoint /login dengan email dan password
      const loginRes = await axios.post(
        "/login",
        { email, password },
        { withCredentials: true } // Mengirim cookies bersama request (penting untuk sesi)
      );
      const accessToken = loginRes.data.accessToken; // Mengambil accessToken dari respons login
      // Menambahkan accessToken ke header default Axios untuk request selanjutnya (otentikasi)
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      
      // Mengambil data user yang sedang login dari backend
      const meRes = await axios.get("/me");
      setUser(meRes.data); // Menyimpan data user ke AuthContext

      navigate("/dashboard"); // Mengarahkan user ke halaman dashboard setelah login sukses
    } catch (err) {
      console.error("Login error:", err); // Menampilkan error di console jika login gagal
      // Menampilkan pesan error dari backend atau pesan default
      setMsg(err.response?.data?.msg || "Login gagal");
    }
  };

  return (
    // Struktur utama halaman login
    <div className="login-container">
      {/* Bagian header login */}
      <div className="login-header">
        <h1 className="login-logo">LOG</h1> {/* Logo aplikasi */}
        <h2 className="login-title">Login</h2> {/* Judul halaman */}
      </div>

      {/* Bagian utama form login */}
      <main className="login-main">
        <form onSubmit={handleLogin} className="login-form">
          {msg && <p className="login-error">{msg}</p>} {/* Menampilkan pesan error jika ada */}

          {/* Input field untuk Email */}
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              required // Wajib diisi
              className="login-input"
              value={email} // Mengikat nilai input ke state email
              onChange={(e) => setEmail(e.target.value)} // Mengupdate state saat input berubah
            />
          </div>

          {/* Input field untuk Password dengan toggle visibilitas */}
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type={showPassword ? "text" : "password"} // Tipe input berubah antara text dan password
              placeholder="Masukkan password"
              required // Wajib diisi
              className="login-input"
              value={password} // Mengikat nilai input ke state password
              onChange={(e) => setPassword(e.target.value)} // Mengupdate state saat input berubah
            />
            {/* Tombol untuk toggle visibilitas password */}
            <span
              className="login-toggle"
              onClick={() => setShowPassword(!showPassword)} // Mengubah state showPassword
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Menampilkan ikon mata terbuka/tertutup */}
            </span>
          </div>

          {/* Tombol untuk submit form login */}
          <button type="submit" className="login-button">
            Login
          </button>

          {/* Link ke halaman daftar/signup */}
          <p className="login-text">
            Belum punya akun?{" "}
            <Link to="/signup" className="login-link">
              Daftar
            </Link>
          </p>
        </form>
      </main>

      {/* Bagian footer halaman login */}
      <footer className="login-footer">
        <p className="login-copyright">
          © 2025 Ronaldo Luxury Car {/* Informasi copyright */}
        </p>
      </footer>
    </div>
  );
};

export default Login; // Mengekspor komponen Login