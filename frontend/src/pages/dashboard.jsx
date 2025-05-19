import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { useAuth } from "../context/AuthContext"; 

const Dashboard = () => {
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
    try {
      if (editingId) {
        await axios.patch(`/products/${editingId}`, form, { withCredentials: true });
      } else {
        await axios.post('/products', form, { withCredentials: true });
      }
      setForm({ name: '', model: '', price: '', description: '', imageName: '', stock: 0, });
      setEditingId(null);
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const handleEdit = (car) => {
    setForm({ name: car.name, model: car.model, price: car.price, description: car.description, imageName: car.imageName, stock: car.stock, });
    setEditingId(car.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', model: '', price: '', description: '', imageName: '', stock: 0, });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`, { withCredentials: true });
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  if (!user) return <p>Loading...</p>;
  if (user.role !== 'manager') return <p>Akses ditolak. Halaman ini hanya untuk manajer.</p>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Mobil' : 'Tambah Mobil'}</h3>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Mobil" required />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model Mobil" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Harga" type="number" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" required />
        <input name="imageName" value={form.imageName} onChange={handleChange} placeholder="Nama Gambar" required />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock Mobil" required />
        <button type="submit">{editingId ? 'Update' : 'Tambah'} Mobil</button>
        {editingId && <button type="button" onClick={handleCancelEdit}>Batal Edit</button>}
      </form>

      <div className="car-list">
        {cars.map((car) => (
          <div key={car.id} className="car-item">
            <img src={`/img/${car.imageName}`} alt={car.name} width="150" />
            <h3>{car.name}</h3>
            <p>Rp {car.price}</p>
            <p>{car.description}</p>
            <button onClick={() => handleEdit(car)}>Edit</button>
            <button onClick={() => handleDelete(car.id)}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
