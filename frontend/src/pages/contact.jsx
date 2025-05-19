import React from 'react';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../css/contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <main className="contact-main">
        <div className="contact-info-box">

          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <div>
              <h4>Alamat</h4>
              <a
                href="https://www.google.com/maps/place/Cibiru,+Bandung,+West+Java"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                Cibiru, Bandung
              </a>
            </div>
          </div>

          <div className="contact-item">
            <FaWhatsapp className="contact-icon" />
            <div>
              <h4>WhatsApp</h4>
              <a href="https://wa.me/6282219457373" target="_blank" rel="noopener noreferrer" className="contact-link">
                +62 822-1945-7373
              </a>
            </div>
          </div>

          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <div>
              <h4>Email</h4>
              <a href="mailto:ronaldocars@gmail.com" className="contact-link">ronaldocars@gmail.com</a>
            </div>
          </div>

          <div className="contact-description">
            <p>Ronaldo Luxury Car Pengalaman Berkendara Mewah dan Berkelas.</p>
          </div>
        </div>
      </main>

      <footer className="contact-footer">
        <p>© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default Contact;
