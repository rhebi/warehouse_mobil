import React, { useEffect, useState } from 'react';
import axios from '../api/axios'; // Mengimpor instance Axios untuk komunikasi API
import { useAuth } from "../context/AuthContext"; // Mengimpor AuthContext untuk mendapatkan data user
import "../css/inventory.css"; // Mengimpor CSS khusus untuk halaman inventori

const InventoryManager = () => {
    const { user } = useAuth(); // Mendapatkan data user yang sedang login
    const [cars, setCars] = useState([]); // State untuk menyimpan daftar mobil/produk
    // State untuk form input penambahan/pengeditan mobil
    const [form, setForm] = useState({
        name: '',
        model: '',
        price: '',
        description: '',
        stock: '',
        location: '',
        status: '',
        gudang: ''
    });
    const [editingId, setEditingId] = useState(null); // State untuk melacak ID mobil yang sedang diedit

    // useEffect akan berjalan saat komponen dimuat atau user berubah
    useEffect(() => {
        // Hanya manager yang bisa mengakses dan mengambil data inventori
        if (user?.role === 'manager') {
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

    // Fungsi untuk menangani submit form (tambah atau update mobil)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah refresh halaman

        // Konversi stock dan price menjadi angka (penting untuk data numerik)
        const payload = {
            ...form,
            stock: Number(form.stock),
            price: Number(form.price)
        };

        try {
            if (editingId) {
                // Jika ada editingId, berarti ini adalah proses update mobil
                await axios.patch(`/products/${editingId}`, payload, { withCredentials: true });
            } else {
                // Jika tidak ada editingId, berarti ini adalah proses tambah mobil baru
                await axios.post('/products', payload, { withCredentials: true });
            }

            // Reset form setelah sukses
            setForm({
                name: '', model: '', price: '', description: '',
                stock: '', location: '', status: '', gudang: ''
            });
            setEditingId(null); // Reset editingId
            fetchCars(); // Refresh daftar mobil
        } catch (error) {
            console.error('Error saving car:', error); // Log error
            alert(`Gagal menyimpan mobil: ${error.response?.data?.message || error.message}`); // Tampilkan pesan error
        }
    };

    // Fungsi untuk menangani tombol "Edit" pada daftar mobil
    const handleEdit = (car) => {
        // Mengisi form dengan data mobil yang akan diedit
        setForm({
            name: car.name, model: car.model, price: car.price, description: car.description,
            stock: car.stock, location: car.location || '', status: car.status || '', gudang: car.gudang || ''
        });
        setEditingId(car.id); // Set ID mobil yang sedang diedit
    };

    // Fungsi untuk menangani tombol "Delete" pada daftar mobil
    const handleDelete = async (id) => {
        // Konfirmasi ke user sebelum menghapus
        if (!window.confirm("Apakah Anda yakin ingin menghapus mobil ini?")) {
            return;
        }
        try {
            await axios.delete(`/products/${id}`, { withCredentials: true }); // Mengirim request DELETE
            fetchCars(); // Refresh daftar mobil
        } catch (error) {
            console.error('Error deleting car:', error); // Log error
            alert(`Gagal menghapus mobil: ${error.response?.data?.message || error.message}`); // Tampilkan pesan error
        }
    };

    // Fungsi untuk membatalkan proses edit
    const handleCancelEdit = () => {
        setEditingId(null); // Reset editingId
        // Reset form ke nilai kosong
        setForm({
            name: '', model: '', price: '', description: '',
            stock: '', location: '', status: '', gudang: ''
        });
    };

    // Menampilkan pesan loading jika data user belum ada
    if (!user) return <p className="text-white text-center py-8">Loading...</p>;
    // Menampilkan pesan akses ditolak jika user bukan manager
    if (user.role !== 'manager') return <p className="text-red-500 text-center py-8">Akses ditolak. Halaman ini hanya untuk manajer.</p>;

    return (
        <div className="inventory-container">
            {/* Judul halaman, berubah sesuai mode (tambah/edit) */}
            <h2 className="inventory-page-title">{editingId ? 'Edit Mobil' : 'Tambah Mobil Baru'}</h2>
            
            {/* Form Tambah/Edit Mobil */}
            <form onSubmit={handleSubmit} className="add-car-form">
                <label>Nama Mobil</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Mobil" required className="input-field" />
                
                <label>Model Mobil</label>
                <input name="model" value={form.model} onChange={handleChange} placeholder="Model Mobil" required className="input-field" />
                
                <label>Harga Mobil</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Harga Mobil" required className="input-field" />
                
                <label>Deskripsi Mobil</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi Mobil" required className="input-field"></textarea>
                
                <label>Stok</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stok" required className="input-field" />
                
                <label>Lokasi</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Lokasi" required className="input-field" />
                
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange} required className="input-field">
                    <option value="">Pilih Status</option>
                    <option value="available">Tersedia</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="sold">Terjual</option>
                </select>
                
                <label>Gudang</label>
                <input name="gudang" value={form.gudang} onChange={handleChange} placeholder="Gudang" required className="input-field" />
                
                {/* Tombol Submit dan Batal Edit */}
                <div className="flex gap-2 justify-center mt-4">
                    <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Tambah'}</button>
                    {editingId && ( // Tampilkan tombol batal hanya saat mode edit
                        <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                            Batal
                        </button>
                    )}
                </div>
            </form>

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
                                <button onClick={() => handleDelete(car.id)} className="btn-delete">Hapus</button> {/* Tombol Hapus */}
                                {/* Tombol Approve/Reject untuk status 'pending' (jika ada, walau di manager biasanya tidak perlu) */}
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

            {/* Bagian footer halaman */}
            <footer className="inventory-footer">
                <p>© 2025 Ronaldo Luxury Car</p>
            </footer>
        </div>
    );
};

export default InventoryManager; // Mengekspor komponen InventoryManager