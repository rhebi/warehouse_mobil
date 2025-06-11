import React, { useEffect, useState } from 'react';
import axios from '../api/axios'; // Mengimpor instance Axios untuk komunikasi API
import { useAuth } from "../context/AuthContext"; // Mengimpor AuthContext untuk mendapatkan data user
import "../css/inventory.css"; // Mengimpor CSS khusus untuk halaman inventori

const InventoryStaff = () => {
    const { user } = useAuth(); // Mendapatkan data user yang sedang login
    const [cars, setCars] = useState([]); // State untuk menyimpan daftar mobil/produk
    // State untuk form input pengeditan mobil oleh staff
    const [form, setForm] = useState({
        stock: 0,
        location: '',
        status: '',
        gudang: ''
    });
    const [editingId, setEditingId] = useState(null); // State untuk melacak ID mobil yang sedang diedit
    const [carNameForEdit, setCarNameForEdit] = useState(''); // State untuk menyimpan nama mobil yang diedit

    // useEffect akan berjalan saat komponen dimuat atau user berubah
    useEffect(() => {
        // Hanya staff yang bisa mengakses dan mengambil data inventori
        if (user?.role === 'staff') {
            fetchCars(); // Ambil data mobil
        }
    }, [user]); // Bergantung pada objek user

    // Fungsi untuk mengambil data mobil/produk dari backend
    const fetchCars = async () => {
        try {
            const response = await axios.get('/products', { withCredentials: true });
            setCars(response.data); // Simpan data mobil ke state
        } catch (error) {
            console.error('Error fetching cars:', error); // Log error
        }
    };

    // Fungsi untuk menangani perubahan pada input form
    const handleChange = (e) => {
        // Update state 'form' sesuai dengan nama input yang berubah
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Fungsi untuk menangani update info mobil oleh staff
    const handleUpdate = async (e) => {
        e.preventDefault(); // Mencegah refresh halaman

        // Validasi input stok harus angka
        if (isNaN(Number(form.stock))) {
            alert("Stok harus berupa angka.");
            return;
        }

        try {
            // Payload hanya berisi data yang bisa diupdate oleh staff
            const payload = {
                stock: Number(form.stock),
                location: form.location,
                status: form.status,
                gudang: form.gudang
            };

            // Mengirim request PATCH ke endpoint khusus staff untuk update terbatas
            await axios.patch(`/products/${editingId}/limited`, payload, { withCredentials: true });

            // Reset form setelah sukses
            setForm({
                stock: 0,
                location: '',
                status: '',
                gudang: ''
            });
            setEditingId(null); // Reset editingId
            setCarNameForEdit(''); // Reset nama mobil yang diedit
            fetchCars(); // Refresh daftar mobil
        } catch (error) {
            console.error('Error updating car:', error); // Log error
            alert(`Gagal memperbarui mobil: ${error.response?.data?.message || error.message}`); // Tampilkan pesan error
        }
    };

    // Fungsi untuk menangani tombol "Edit" pada daftar mobil
    const handleEdit = (car) => {
        // Mengisi form dengan data mobil yang akan diedit oleh staff
        setForm({
            stock: car.stock,
            location: car.location || '',
            status: car.status || '',
            gudang: car.gudang || ''
        });
        setEditingId(car.id); // Set ID mobil yang sedang diedit
        setCarNameForEdit(car.name); // Simpan nama mobil untuk ditampilkan di judul form edit
    };

    // Fungsi untuk membatalkan proses edit
    const handleCancelEdit = () => {
        setEditingId(null); // Reset editingId
        setCarNameForEdit(''); // Reset nama mobil
        // Reset form ke nilai default
        setForm({
            stock: 0,
            location: '',
            status: '',
            gudang: ''
        });
    };

    // Menampilkan pesan loading jika data user belum ada
    if (!user) return <p className="text-white text-center py-8">Loading...</p>;
    // Menampilkan pesan akses ditolak jika user bukan staff
    if (user.role !== 'staff') return <p className="text-red-500 text-center py-8">Akses ditolak. Halaman ini hanya untuk staf.</p>;

    return (
        <div className="inventory-container">
            {/* Form Edit Mobil (Hanya tampil saat ada mobil yang sedang diedit) */}
            {editingId && (
                <form onSubmit={handleUpdate} className="add-car-form">
                    <h2 className="text-xl font-semibold mb-4">Edit Info Mobil: {carNameForEdit}</h2> {/* Judul form edit */}
                    
                    <label>Stok Mobil</label>
                    <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stok Mobil" type="number" required className="input-field" />
                    
                    <label>Lokasi Mobil</label>
                    <input name="location" value={form.location} onChange={handleChange} placeholder="Lokasi Mobil" required className="input-field" />
                    
                    <label>Status</label>
                    <select name="status" value={form.status} onChange={handleChange} required className="input-field">
                        <option value="">Pilih Status</option>
                        <option value="available">Tersedia</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="sold">Terjual</option>
                    </select>
                    
                    <label>Gudang Mobil</label>
                    <input name="gudang" value={form.gudang} onChange={handleChange} placeholder="Gudang Mobil" required className="input-field" />
                    
                    {/* Tombol Update dan Batal Edit */}
                    <div className="flex gap-2 justify-center mt-4">
                        <button type="submit" className="btn-primary">Update Info</button>
                        <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                            Batal Edit
                        </button>
                    </div>
                </form>
            )}

            {/* Daftar Mobil (Tampilan Card) */}
            <div className="card-list">
                {cars.length === 0 ? (
                    <p className="text-center text-white col-span-full">Tidak ada data mobil.</p>
                ) : (
                    // Mapping (mengulang) daftar mobil untuk ditampilkan sebagai kartu
                    cars.map((car) => (
                        <div key={car.id} className="car-card">
                            <div className="car-info">
                                <p><strong>{car.name}</strong> - {car.model}</p>
                                <p>Rp {parseInt(car.price).toLocaleString()}</p>
                                <p>Stok: {car.stock}</p>
                                <p>Lokasi: {car.location}</p>
                                <p>Status: <span className={`status-${car.status.toLowerCase()}`}>{car.status}</span></p> {/* Styling status */}
                                <p>Gudang: {car.gudang}</p>
                                <p>{car.description}</p>
                                {/* Menampilkan informasi user yang terakhir mengupdate (jika ada) */}
                                {car.updater && <p className="updater-info">Terakhir diupdate oleh: {car.updater.name}</p>}
                            </div>
                            <div className="card-actions flex gap-2 mt-2">
                                <button onClick={() => handleEdit(car)} className="btn-edit">Edit</button> {/* Tombol Edit */}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bagian footer halaman */}
            <footer className="inventory-footer">
                <p>© 2025 Ronaldo Luxury Car</p>
            </footer>
        </div>
    );
};

export default InventoryStaff; // Mengekspor komponen InventoryStaff