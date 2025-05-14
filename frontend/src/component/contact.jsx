import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/contact.css';

const Contact = () => {
  const navigate = useNavigate();

  // References for input fields
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const reasonRef = useRef(null);

  // Redirect to Home after form submission
  useEffect(() => {
    const button = document.querySelector('.contact-button');

    const handleRedirect = (e) => {
      e.preventDefault(); // Prevent default form submission

      // Get values from input fields
      const name = nameRef.current.value.trim();
      const email = emailRef.current.value.trim();
      const reason = reasonRef.current.value.trim();

      // Validate inputs
      if (!name || !email || !reason) {
        alert('isi semua kolom sebelum lanjut ke Home.');
        return;
      }

      // isi semua kolom sebelum lanjut ke Home
      navigate('/');
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
              ref={nameRef} 
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
              ref={emailRef} 
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
              ref={reasonRef} 
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