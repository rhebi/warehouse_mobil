import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from "../context/AuthContext";
import "../css/inventory.css";

const InventoryManager = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    name: '',
    model: '',
    price: '',
    description: '',
    stock: '',
    location: '',
    status: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (user?.role === 'manager') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        await axios.patch(`/products/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post('/products', payload, { withCredentials: true });
      }

      setForm({
        name: '',
        model: '',
        price: '',
        description: '',
        stock: '',
        location: '',
        status: ''
      });
      setEditingId(null);
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`, { withCredentials: true });
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: '',
      model: '',
      price: '',
      description: '',
      stock: '',
      location: '',
      status: ''
    });
  };

  if (!user) return <p>Loading...</p>;
  if (user.role !== 'manager') return <p>Akses ditolak. Halaman ini hanya untuk manajer.</p>;

  return (
    <div className="inventory-container">
      <form onSubmit={handleSubmit} className="add-car-form">
        <h2>{editingId ? 'Edit Mobil' : 'Tambah Mobil Baru'}</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Mobil" required />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model Mobil" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Harga Mobil" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi Mobil" required />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stok" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Lokasi" required />
        <input name="status" value={form.status} onChange={handleChange} placeholder="Status (tersedia/service/dll)" required />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit">{editingId ? 'Update' : 'Tambah'}</button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#e11d48', color: 'white' }}>
              Batal
            </button>
          )}
        </div>
      </form>

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
              <button onClick={() => handleDelete(car.id)} style={{ backgroundColor: '#e11d48', color: 'white' }}>
                Hapus
              </button>
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

export default InventoryManager;
