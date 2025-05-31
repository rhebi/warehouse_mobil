import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from "../context/AuthContext";
import "../css/inventory.css";

const InventoryStaff = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    name: '',
    model: '',
    price: '',
    description: '',
    stock: 0,
    location: '',
    status: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (user?.role === 'staff') {
      fetchCars();
    }
  }, [user]);

  const fetchCars = async () => {
    try {
      const response = await axios.get('/products', { withCredentials: true });
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isNaN(Number(form.stock))) {
      alert("Stock harus berupa angka.");
      return;
    }

    try {
      const payload = {
        stock: Number(form.stock),
        location: form.location,
        status: form.status,
      };

      await axios.patch(`/products/${editingId}/stock`, payload, { withCredentials: true });

      setForm({
        name: '',
        model: '',
        price: '',
        description: '',
        stock: 0,
        location: '',
        status: ''
      });
      setEditingId(null);
      fetchCars();
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  const handleEdit = (car) => {
    setForm({
      name: car.name,
      model: car.model,
      price: car.price,
      description: car.description,
      stock: car.stock,
      location: car.location || '',
      status: car.status || ''
    });
    setEditingId(car.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: '',
      model: '',
      price: '',
      description: '',
      stock: 0,
      location: '',
      status: ''
    });
  };

  if (!user) return <p>Loading...</p>;
  if (user.role !== 'staff') return <p>Akses ditolak. Halaman ini hanya untuk staf.</p>;

  return (
    <div className="inventory-container">
      {editingId && (
        <form onSubmit={handleUpdate} className="add-car-form">
          <h2>Edit Info Mobil</h2>
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock Mobil" type="number" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Lokasi Mobil" required />
          <input name="status" value={form.status} onChange={handleChange} placeholder="Status Mobil (contoh: tersedia / service)" required />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit">Update Mobil</button>
            <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#e11d48', color: 'white' }}>
              Batal Edit
            </button>
          </div>
        </form>
      )}

      <div className="card-list">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <div className="car-info">
              <p><strong>{car.name}</strong> - {car.model}</p>
              <p>Rp {parseInt(car.price).toLocaleString()}</p>
              <p>Stok: {car.stock}</p>
              <p>Lokasi: {car.location}</p>
              <p>Status: {car.status}</p>
              <p>{car.description}</p>
            </div>
            <div className="card-actions">
              <button onClick={() => handleEdit(car)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      <footer className="inventory-footer">
        &copy; {new Date().getFullYear()} 2025 Ronaldo Luxury Car
      </footer>
    </div>
  );
};

export default InventoryStaff;
