import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // References for input fields
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const roleRef = useRef(null); // New ref for role selection

  // Redirect to Home after form submission
  useEffect(() => {
    const button = document.querySelector('.signup-button');

    const handleRedirect = (e) => {
      e.preventDefault(); // Prevent default form submission

      // Get values from input fields
      const name = nameRef.current.value.trim();
      const email = emailRef.current.value.trim();
      const password = passwordRef.current.value.trim();
      const role = roleRef.current.value; // Get selected role

      // Validate inputs
      if (!name || !email || !password || !role) {
        alert('Semua kolom wajib diisi.');
        return;
      }

      // Save user info including role in localStorage
      const userData = {
        name,
        email,
        role
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // Go to Home page
      navigate('/');
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
              ref={nameRef}
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
              ref={emailRef}
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
              ref={passwordRef}
            />
            <span
              className="signup-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle Password"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Role Selection */}
          <div className="signup-field">
            <label htmlFor="role" className="signup-label">Role</label>
            <select
              id="role"
              className="signup-input"
              defaultValue="staff"
              ref={roleRef} // Add ref here
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
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