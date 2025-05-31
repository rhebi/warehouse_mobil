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
        status: '',
        gudang: '' // Tambahkan gudang di form
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
            // Tambahkan penanganan error yang lebih baik di UI jika perlu
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            stock: Number(form.stock),
            price: Number(form.price) // Pastikan harga juga number
        };

        try {
            if (editingId) {
                await axios.patch(`/products/${editingId}`, payload, { withCredentials: true });
            } else {
                await axios.post('/products', payload, { withCredentials: true });
            }

            // Reset form setelah berhasil
            setForm({
                name: '',
                model: '',
                price: '',
                description: '',
                stock: '',
                location: '',
                status: '',
                gudang: ''
            });
            setEditingId(null);
            fetchCars(); // Refresh daftar mobil
        } catch (error) {
            console.error('Error saving car:', error);
            alert(`Gagal menyimpan mobil: ${error.response?.data?.message || error.message}`);
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
            status: car.status || '',
            gudang: car.gudang || '' // Load gudang saat edit
        });
        setEditingId(car.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus mobil ini?")) {
            return;
        }
        try {
            await axios.delete(`/products/${id}`, { withCredentials: true });
            fetchCars();
        } catch (error) {
            console.error('Error deleting car:', error);
            alert(`Gagal menghapus mobil: ${error.response?.data?.message || error.message}`);
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
            status: '',
            gudang: ''
        });
    };

    if (!user) return <p className="text-white text-center py-8">Loading...</p>;
    if (user.role !== 'manager') return <p className="text-red-500 text-center py-8">Akses ditolak. Halaman ini hanya untuk manajer.</p>;

    return (
        <div className="inventory-container text-black">
            <form onSubmit={handleSubmit} className="add-car-form bg-gray-100 p-4 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Mobil' : 'Tambah Mobil Baru'}</h2>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Mobil" required className="input-field" />
                <input name="model" value={form.model} onChange={handleChange} placeholder="Model Mobil" required className="input-field" />
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Harga Mobil" required className="input-field" />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi Mobil" required className="input-field h-20 resize-y"></textarea>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stok" required className="input-field" />
                <input name="location" value={form.location} onChange={handleChange} placeholder="Lokasi" required className="input-field" />
                <select name="status" value={form.status} onChange={handleChange} required className="input-field">
                    <option value="">Pilih Status</option>
                    <option value="available">Tersedia</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="sold">Terjual</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
                <input name="gudang" value={form.gudang} onChange={handleChange} placeholder="Gudang" required className="input-field" />
                <div className="flex gap-2">
                    <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Tambah'}</button>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                            Batal
                        </button>
                    )}
                </div>
            </form>

            <div className="card-list">
                {cars.length === 0 ? (
                    <p className="text-center text-white col-span-full">Tidak ada data mobil.</p>
                ) : (
                    cars.map((car) => (
                        <div key={car.id} className="car-card bg-gray-100 p-4 rounded shadow">
                            <div className="car-info">
                                <p><strong>{car.name}</strong> - {car.model}</p>
                                <p>Rp {parseInt(car.price).toLocaleString()}</p>
                                <p>Stok: {car.stock}</p>
                                <p>Lokasi: {car.location}</p>
                                <p>Status: <span className={`status-${car.status.toLowerCase()}`}>{car.status}</span></p>
                                <p>Gudang: {car.gudang}</p>
                                <p>{car.description}</p>
                                {car.updater && <p className="text-xs text-gray-600">Terakhir diupdate oleh: {car.updater.name}</p>}
                            </div>
                            <div className="card-actions flex gap-2 mt-2">
                                <button onClick={() => handleEdit(car)} className="btn-edit">Edit</button>
                                <button onClick={() => handleDelete(car.id)} className="btn-delete">Hapus</button>
                                {/* Tambahkan tombol approve/reject jika perlu di InventoryManager */}
                                {car.status === 'pending' && (
                                    <>
                                        <button onClick={() => axios.patch(`/products/${car.id}/approve`, {}, { withCredentials: true }).then(fetchCars)} className="btn-approve">Approve</button>
                                        <button onClick={() => axios.patch(`/products/${car.id}/reject`, {}, { withCredentials: true }).then(fetchCars)} className="btn-reject">Reject</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer className="inventory-footer mt-6 text-center text-white">
                &copy; {new Date().getFullYear()} 2025 Ronaldo Luxury Car
            </footer>
        </div>
    );
};

export default InventoryManager;