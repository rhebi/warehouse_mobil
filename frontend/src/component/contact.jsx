import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/contact.css';

const Contact = () => {
  const navigate = useNavigate();

  // Redirect to Home after form submission
  useEffect(() => {
    const button = document.querySelector('.contact-button');

    const handleRedirect = (e) => {
      e.preventDefault(); // Cegah reload bawaan
      navigate('/home');
    };

    button?.addEventListener('click', handleRedirect);

    return () => {
      button?.removeEventListener('click', handleRedirect);
    };
  }, [navigate]);

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1 className="contact-logo">LOG</h1>
        <h2 className="contact-title">Contact</h2>
      </header>

      <main className="contact-main">
        <form className="contact-form">
          {/* Name */}
          <div className="contact-field">
            <label htmlFor="name" className="contact-label">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="contact-input"
              aria-label="Your Name"
              required
            />
          </div>

          {/* Email */}
          <div className="contact-field">
            <label htmlFor="email" className="contact-label">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="contact-input"
              aria-label="Your Email"
              required
            />
          </div>

          {/* Reason */}
          <div className="contact-field">
            <label htmlFor="reason" className="contact-label">Reason</label>
            <input
              type="text"
              id="reason"
              placeholder="Enter your reason"
              className="contact-input"
              aria-label="Your Reason"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="contact-button">
            Send Now
          </button>
        </form>
      </main>

      <footer className="contact-footer">
        <p className="contact-copyright">
          © 2025 Ronaldo Luxury Car
        </p>
      </footer>
    </div>
  );
};

export default Contact;