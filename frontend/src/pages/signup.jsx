import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import '../css/signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from "../api/axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users", {
        name,
        email,
        password,
        confpassword: confPassword 
      });
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Signup gagal");
    }
  };

  return (
    <div className="signup-container">
      <header className="signup-header">
        <h1 className="signup-logo">LOG</h1>
        <h2 className="signup-title">Sign Up</h2>
      </header>

      <main className="signup-main">
        <form className="signup-form" onSubmit={handleSignup}>
          {msg && <p className="text-red-500 text-sm mb-3">{msg}</p>}

          <div className="signup-field">
            <label htmlFor="name" className="signup-label">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="signup-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email" className="signup-label">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signup-field relative">
            <label htmlFor="password" className="signup-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="signup-input pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="signup-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="signup-field relative">
            <label htmlFor="confPassword" className="signup-label">Confirm Password</label>
            <input
              type={showConfPassword ? "text" : "password"}
              id="confPassword"
              placeholder="Confirm your password"
              className="signup-input pr-10"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            />
            <span
              className="signup-toggle"
              onClick={() => setShowConfPassword((prev) => !prev)}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)'
              }}
            >
              {showConfPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="signup-button mt-4">
            Create Account
          </button>

          <p className="mt-4 text-center">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">login</Link>
          </p>
        </form>
      </main>

      <footer className="signup-footer">
        <p>© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default Signup;
