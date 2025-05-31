import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/login.css";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await axios.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );
      const accessToken = loginRes.data.accessToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const meRes = await axios.get("/me");
      setUser(meRes.data);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setMsg(err.response?.data?.msg || "Login gagal");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-logo">LOG</h1>
        <h2 className="login-title">Login</h2>
      </div>

      <main className="login-main">
        <form onSubmit={handleLogin} className="login-form">
          {msg && <p className="login-error">{msg}</p>}

          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              required
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              required
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="login-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <p className="login-text">
            Belum punya akun?{" "}
            <Link to="/signup" className="login-link">
              Daftar
            </Link>
          </p>
        </form>
      </main>

      <footer className="login-footer">
        <p className="login-copyright">
          &copy; {new Date().getFullYear()} 2025 Ronaldo Luxury Car
        </p>
      </footer>
    </div>
  );
};

export default Login;
