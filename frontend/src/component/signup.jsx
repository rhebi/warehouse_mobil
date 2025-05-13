import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const button = document.querySelector('.signup-button');

    const handleRedirect = (e) => {
      e.preventDefault(); // Cegah reload
      navigate('/home');
    };

    button?.addEventListener('click', handleRedirect);

    return () => {
      button?.removeEventListener('click', handleRedirect);
    };
  }, [navigate]);

  return (
    <div className="signup-container">
      <header className="signup-header">
        <h1 className="signup-logo">LOG</h1>
        <h2 className="signup-title">Sign Up</h2>
      </header>

      <main className="signup-main">
        <form className="signup-form">
          {/* Name */}
          <div className="signup-field">
            <label htmlFor="name" className="signup-label">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="signup-input"
              aria-label="Your Name"
              required
            />
          </div>

          {/* Email */}
          <div className="signup-field">
            <label htmlFor="email" className="signup-label">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="signup-input"
              aria-label="Your Email"
              required
            />
          </div>

          {/* Password */}
          <div className="signup-field relative">
            <label htmlFor="password" className="signup-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="signup-input pr-10"
              aria-label="Your Password"
              required
            />
            <span
              className="signup-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle Password"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>
      </main>

      <footer className="signup-footer">
        <p className="signup-copyright">
          © 2025 Ronaldo Luxury Car
        </p>
      </footer>
    </div>
  );
};

export default Signup;
