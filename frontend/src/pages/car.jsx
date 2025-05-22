import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import "../css/car.css";

const Car = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('/public/products', {
          withCredentials: true
        });
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="car-container">
      <section className="car-section">
        <h2 className="car-title">Explore Our Collection</h2>
        <div className="car-grid">
          {cars.map((car) => (
            <div className="car-card" key={car.id}>
              <img
                src={`/img/${car.imageName}`} // Ambil gambar langsung dari public/img/
                alt={car.name}
                className="car-image"
              />
              <h3 className="car-name">{car.name}</h3>
              <p className="car-price">{car.price}</p>
              <p className="car-description">{car.description}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="car-footer">
        <p>© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default Car;
