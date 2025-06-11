import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // Mengimpor instance Axios untuk komunikasi dengan API
import { useAuth } from "../context/AuthContext"; // Mengimpor AuthContext untuk mendapatkan data user
import "../css/stockmovement.css"; // Mengimpor CSS khusus untuk halaman pergerakan stok

const StockMovement = () => {
    const { user } = useAuth(); // Mendapatkan data user yang sedang login
    const [products, setProducts] = useState([]); // State untuk menyimpan daftar produk
    const [movements, setMovements] = useState([]); // State untuk menyimpan daftar pergerakan stok
    const [loading, setLoading] = useState(true); // State untuk indikator loading
    const [error, setError] = useState(null); // State untuk menyimpan pesan error

    // State untuk form input pergerakan stok
    const [movementForm, setMovementForm] = useState({
        productId: '',
        quantity: '',
        type: 'inbound', // Default: inbound (Masuk)
        reason: '',
        locationFrom: '', 
        locationTo: '',   
        notes: ''
    });

    // useEffect akan berjalan saat komponen dimuat atau user berubah
    useEffect(() => {
        // Hanya manager yang bisa mengakses dan mengambil data
        if (user?.role === 'manager') {
            fetchProducts(); // Ambil data produk
            fetchMovements(); // Ambil data pergerakan stok
        } else {
            setLoading(false); // Kalau bukan manager, set loading false aja
        }
    }, [user]); // Bergantung pada objek user

    // Fungsi untuk mengambil data produk dari backend
    const fetchProducts = async () => {
        try {
            const res = await axios.get('/products', { withCredentials: true });
            setProducts(res.data); // Simpan data produk ke state
        } catch (err) {
            console.error('Error fetching products:', err); // Log error
            // alert(`Gagal ambil data produk: ${err.response?.data?.message || err.message}`); // Bisa ditampilkan ke user
        }
    };

    // Fungsi untuk mengambil data pergerakan stok dari backend
    const fetchMovements = async () => {
        setLoading(true); // Set loading jadi true
        setError(null); // Reset error
        try {
            const res = await axios.get('/inventory-movements', { withCredentials: true });
            setMovements(res.data); // Simpan data pergerakan stok ke state
        } catch (err) {
            console.error('Error fetching inventory movements:', err); // Log error
            setError(`Gagal ambil data pergerakan stok: ${err.response?.data?.message || err.message}`); // Set pesan error
            setMovements([]); // Kosongkan data pergerakan stok jika gagal
        } finally {
            setLoading(false); // Set loading jadi false setelah selesai (sukses/gagal)
        }
    };

    // Fungsi untuk menangani perubahan pada input form
    const handleMovementChange = (e) => {
        // Update state movementForm sesuai dengan input yang berubah
        setMovementForm({ ...movementForm, [e.target.name]: e.target.value });
    };

    // Fungsi untuk menangani submit form pencatatan pergerakan stok
    const handleRecordMovement = async (e) => {
        e.preventDefault(); // Mencegah refresh halaman

        // Validasi dasar input form
        if (!movementForm.productId || !movementForm.quantity || !movementForm.type || !movementForm.reason) {
            alert('Wajib isi semua kolom: Produk, Kuantitas, Tipe, dan Alasan.');
            return;
        }
        if (isNaN(Number(movementForm.quantity)) || Number(movementForm.quantity) <= 0) {
            alert('Kuantitas harus angka positif ya.');
            return;
        }

        try {
            // Membuat payload (data yang akan dikirim ke backend)
            const payload = {
                product_id: Number(movementForm.productId),
                quantity: Number(movementForm.quantity),
                type: movementForm.type,
                reason: movementForm.reason,
                location_from: movementForm.locationFrom || null, // Jika kosong, kirim null
                location_to: movementForm.locationTo || null,   // Jika kosong, kirim null
                notes: movementForm.notes || null,             // Jika kosong, kirim null
            };

            // Mengirim request POST untuk mencatat pergerakan stok
            await axios.post('/inventory-movements', payload, { withCredentials: true });
            alert('Pergerakan stok sudah dicatat dan stoknya di-update!');
            
            // Reset form setelah sukses
            setMovementForm({
                productId: '', quantity: '', type: 'inbound', reason: '',
                locationFrom: '', locationTo: '', notes: ''
            });
            
            // Refresh data produk dan pergerakan stok
            fetchProducts(); 
            fetchMovements(); 
        } catch (error) {
            console.error('Error recording inventory movement:', error); // Log error
            alert(`Gagal catat pergerakan stok: ${error.response?.data?.message || error.message}`); // Tampilkan pesan error ke user
        }
    };

    // Menampilkan pesan loading jika data sedang dimuat
    if (loading) return <p className="text-white text-center py-8">Loading data pergerakan stok...</p>;
    // Menampilkan pesan error jika terjadi kesalahan
    if (error) return <p className="text-red-500 text-center py-8">{error}</p>;
    // Menampilkan pesan akses ditolak jika user bukan manager
    if (!user || user.role !== 'manager') return <p className="text-red-500 text-center py-8">Maaf, halaman ini khusus untuk manajer.</p>;

    return (
        <div className="stock-movement-container text-black">
            <h2 className="stock-movement-title text-white">Movement Pergerakan Stock</h2>

            {/* Form Catat Pergerakan Stok */}
            <form onSubmit={handleRecordMovement} className="stock-movement-form bg-gray-100 p-4 rounded shadow mb-6">
                {/* Pilih Produk */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Produk:</label>
                <select
                    name="productId"
                    value={movementForm.productId}
                    onChange={handleMovementChange}
                    className="input mb-3 w-full px-3 py-2 border rounded"
                    required
                >
                    <option value="">-- Pilih Produk --</option>
                    {/* Menampilkan daftar produk dari state products */}
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} (Stok: {product.stock})
                        </option>
                    ))}
                </select>

                {/* Tipe Pergerakan (Masuk/Keluar) */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pergerakan:</label>
                <select
                    name="type"
                    value={movementForm.type}
                    onChange={handleMovementChange}
                    className="input mb-3 w-full px-3 py-2 border rounded"
                    required
                >
                    <option value="inbound">Masuk</option>
                    <option value="outbound">Keluar</option>
                </select>

                {/* Kuantitas */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Kuantitas:</label>
                <input
                    name="quantity"
                    type="number"
                    value={movementForm.quantity}
                    onChange={handleMovementChange}
                    placeholder="Berapa banyak barangnya"
                    required
                    min="1" // Minimal kuantitas 1
                    className="input mb-3 w-full px-3 py-2 border rounded"
                />

                {/* Alasan Pergerakan */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Pergerakan:</label>
                <input
                    name="reason"
                    value={movementForm.reason}
                    onChange={handleMovementChange}
                    placeholder="Contoh: Barang baru datang, Rusak, Terjual"
                    required
                    className="input mb-3 w-full px-3 py-2 border rounded"
                />

                {/* Lokasi Asal */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Asal:</label>
                <input
                    name="locationFrom"
                    value={movementForm.locationFrom}
                    onChange={handleMovementChange}
                    placeholder="Contoh: Gudang Lama, Supplier"
                    className="input mb-3 w-full px-3 py-2 border rounded"
                />
                
                {/* Lokasi Tujuan */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Tujuan:</label>
                <input
                    name="locationTo"
                    value={movementForm.locationTo}
                    onChange={handleMovementChange}
                    placeholder="Contoh: Gudang Baru, Pelanggan"
                    className="input mb-3 w-full px-3 py-2 border rounded"
                />
                
                {/* Catatan Tambahan */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan:</label>
                <textarea
                    name="notes"
                    value={movementForm.notes}
                    onChange={handleMovementChange}
                    placeholder="Tulis catatan detail lainnya di sini biar jelas"
                    className="input mb-4 w-full px-3 py-2 border rounded h-20 resize-y"
                ></textarea>

                {/* Tombol submit form */}
                <button type="submit" className="btn bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition w-full">
                    Catat Pergerakan Stok
                </button>
            </form>

            {/* Tabel Riwayat Pergerakan Stok */}
            <h2 className="stock-movement-title text-white mt-8">Riwayat Pergerakan Stok</h2>
            <table className="stock-movement-table bg-gray-100">
                <thead className="stock-movement-table-header">
                    <tr>
                        <th>ID</th>
                        <th>Tanggal</th>
                        <th>Produk</th>
                        <th>Kuantitas</th>
                        <th>Tipe</th>
                        <th>Alasan</th>
                        <th>Dari</th>
                        <th>Ke</th>
                        <th>Oleh User</th>
                        <th>Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Menampilkan pesan jika tidak ada riwayat pergerakan stok */}
                    {movements.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="stock-movement-empty text-center py-4">
                                Belum ada riwayat pergerakan stok.
                            </td>
                        </tr>
                    ) : (
                        // Mapping (mengulang) data pergerakan stok untuk ditampilkan di tabel
                        movements.map((move) => (
                            <tr key={move.id} className="stock-movement-row">
                                <td>{move.id}</td>
                                <td>{new Date(move.createdAt).toLocaleString()}</td> {/* Format tanggal */}
                                <td>{move.product?.name || '-'}</td> {/* Nama produk (jika ada) */}
                                <td>{move.quantity}</td>
                                <td><span className={`status-${move.type.toLowerCase()}`}>{move.type === 'inbound' ? 'Masuk' : 'Keluar'}</span></td> {/* Tipe pergerakan */}
                                <td>{move.reason || '-'}</td>
                                <td>{move.location_from || '-'}</td>
                                <td>{move.location_to || '-'}</td>
                                <td>{move.user?.name || '-'}</td> {/* Nama user yang mencatat */}
                                <td>{move.notes || '-'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Bagian footer halaman */}
            <footer className="stock-movement-footer mt-6 text-center text-white">
                <p>© 2025 Ronaldo Luxury Car</p>
            </footer>
        </div>
    );
};

export default StockMovement; // Mengekspor komponen StockMovement