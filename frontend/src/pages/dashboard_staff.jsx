import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from "../context/AuthContext";
import "../css/dashboard.css";

const DashboardStaff = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    name: '',
    model: '',
    price: '',
    description: '',
    imageName: '',
    stock: 0
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

    if (user.role === 'staff') {
      // Validasi: pastikan stock angka
      if (isNaN(Number(form.stock))) {
        alert("Stock harus berupa angka.");
        return;
      }
    }

    try {
      let payload = {};

      if (user.role === 'staff') {
        payload = {
          stock: Number(form.stock), // pastikan dikirim sebagai angka
        };
      } else {
        payload = { ...form };
      }

      await axios.patch(`/products/${editingId}/stock`, payload, { withCredentials: true });

      setForm({
        name: '',
        model: '',
        price: '',
        description: '',
        imageName: '',
        stock: 0,
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
      imageName: car.imageName,
      stock: car.stock,
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
      imageName: '',
      stock: 0,
    });
  };

  if (!user) return <p>Loading...</p>;
  if (user.role !== 'staff') return <p>Akses ditolak. Halaman ini hanya untuk staf.</p>;

  return (
    <div className="dashboard-container">
      {editingId && (
        <form onSubmit={handleUpdate} className="add-car-form">
          <h2>Edit Mobil</h2>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Mobil" required />
          <input name="model" value={form.model} onChange={handleChange} placeholder="Model Mobil" required />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Harga" type="number" required />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" required />
          <input name="imageName" value={form.imageName} onChange={handleChange} placeholder="Nama Gambar" required />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock Mobil" type="number" required />
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
            <img src={`/img/${car.imageName}`} alt={car.name} />
            <div className="car-info">
              <p><strong>{car.name}</strong> - {car.model}</p>
              <p>Rp {parseInt(car.price).toLocaleString()}</p>
              <p>Stok: {car.stock}</p>
              <p>{car.description}</p>
            </div>
            <div className="card-actions">
              <button onClick={() => handleEdit(car)}>Edit</button>
              {/* Tidak ada tombol Hapus */}
            </div>
          </div>
        ))}
      </div>

      <footer className="dashboard-footer">
        &copy; {new Date().getFullYear()} 2025 Ronaldo Luxury Car
      </footer>
    </div>
  );
};

export default DashboardStaff;
