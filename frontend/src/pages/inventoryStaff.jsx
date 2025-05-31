import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from "../context/AuthContext";
import "../css/inventory.css";

const InventoryStaff = () => {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [form, setForm] = useState({
        stock: 0,
        location: '',
        status: '',
        gudang: '' // Tambahkan gudang
    });
    const [editingId, setEditingId] = useState(null);
    const [carNameForEdit, setCarNameForEdit] = useState(''); // Untuk menampilkan nama mobil yang sedang diedit

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
            // Tambahkan penanganan error di UI jika perlu
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (isNaN(Number(form.stock))) {
            alert("Stok harus berupa angka.");
            return;
        }

        try {
            const payload = {
                stock: Number(form.stock),
                location: form.location,
                status: form.status,
                gudang: form.gudang // Kirim data gudang
            };

            // Perbaikan URL endpoint: dari /products/:id/stock menjadi /products/:id/limited
            await axios.patch(`/products/${editingId}/limited`, payload, { withCredentials: true });

            setForm({
                stock: 0,
                location: '',
                status: '',
                gudang: ''
            });
            setEditingId(null);
            setCarNameForEdit('');
            fetchCars();
        } catch (error) {
            console.error('Error updating car:', error);
            alert(`Gagal memperbarui mobil: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleEdit = (car) => {
        setForm({
            stock: car.stock,
            location: car.location || '',
            status: car.status || '',
            gudang: car.gudang || ''
        });
        setEditingId(car.id);
        setCarNameForEdit(car.name); // Simpan nama mobil untuk ditampilkan
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setCarNameForEdit('');
        setForm({
            stock: 0,
            location: '',
            status: '',
            gudang: ''
        });
    };

    if (!user) return <p className="text-white text-center py-8">Loading...</p>;
    if (user.role !== 'staff') return <p className="text-red-500 text-center py-8">Akses ditolak. Halaman ini hanya untuk staf.</p>;

    return (
        <div className="inventory-container text-black">
            {editingId && (
                <form onSubmit={handleUpdate} className="add-car-form bg-gray-100 p-4 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Info Mobil: {carNameForEdit}</h2>
                    <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stok Mobil" type="number" required className="input-field" />
                    <input name="location" value={form.location} onChange={handleChange} placeholder="Lokasi Mobil" required className="input-field" />
                    <select name="status" value={form.status} onChange={handleChange} required className="input-field">
                        <option value="">Pilih Status</option>
                        <option value="available">Tersedia</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="sold">Terjual</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <input name="gudang" value={form.gudang} onChange={handleChange} placeholder="Gudang Mobil" required className="input-field" />
                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary">Update Info</button>
                        <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                            Batal Edit
                        </button>
                    </div>
                </form>
            )}

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
                                <button onClick={() => handleEdit(car)} className="btn-edit">Edit Stok/Lokasi/Status/Gudang</button>
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

export default InventoryStaff;