import React from 'react';
import { Link } from "react-router-dom";
import '../css/car.css';
import chiron from '../img/chiron_merah.jpg';
import veyron from '../img/veyron.jpg';
import divo from '../img/divo.jpg';
import bolide from '../img/bolide.jpg';

const Car = () => {
  return (
    <div className="car-container">
      {/* Header */}
      <header className="car-header">
        <div className="car-logo">LOG</div>
        <nav className="car-navbar">
          <Link to="/home" className="car-nav-link">Home</Link>
          <Link to="/car" className="car-nav-link">Our Cars</Link>
          <Link to="/about" className="car-nav-link">About</Link>
          <Link to="/contact" className="car-nav-link">Contact</Link>
        </nav>
        <div className="car-manager">
          <Link to="/signup" className="car-manager-link">
            <img
              src="https://i.pinimg.com/474x/22/a3/33/22a33358af3ae57621d01aac0a01f8ae.jpg "
              alt="Manager Icon"
              className="car-manager-icon"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="car-section">
        <h2 className="car-title">Explore Our Collection</h2>
        <div className="car-grid">
          {[
            {
              name: 'Bugatti Chiron',
              price: 'Rp38–160 Miliar',
              desc: 'Mahakarya yang diciptakan untuk menguji batas kecepatan absolut.',
              img: chiron,
            },
            {
              name: 'Bugatti Veyron',
              price: 'Rp150–200 Miliar',
              desc: 'Ikon supercar era modern dengan teknologi dan desain aerodinamis.',
              img: veyron,
            },
            {
              name: 'Bugatti Divo',
              price: 'Rp150-200 Miliar',
              desc: 'Hypercar dengan handling dan aerodinamika terbaik.',
              img: divo,
            },
            {
              name: 'Bugatti Bolide',
              price: 'Rp150-200 Miliar',
              desc: 'Edisi terbatas untuk merayakan 110 tahun Bugatti.',
              img: bolide,
            },
          ].map((car, idx) => (
            <div className="car-card" key={idx}>
              <img src={car.img} alt={car.name} className="car-image" />
              <h3 className="car-name">{car.name}</h3>
              <p className="car-price">{car.price}</p>
              <p className="car-description">{car.desc}</p>
              <div className="car-actions">
                <button className="car-edit-btn">Edit</button>
                <button className="car-delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="car-footer">
        <p className="car-copyright">© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default Car;