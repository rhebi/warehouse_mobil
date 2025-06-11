import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // Mengimpor instance Axios untuk komunikasi API
import "../css/transaction.css"; // Mengimpor CSS khusus untuk halaman transaksi
import { useAuth } from "../context/AuthContext"; // Mengimpor AuthContext untuk mendapatkan data user

const Transaction = () => {
    const { user } = useAuth(); // Mendapatkan data user yang sedang login
    const [transactions, setTransactions] = useState([]); // State untuk menyimpan daftar transaksi
    const [products, setProducts] = useState([]); // State untuk menyimpan daftar produk
    // State untuk form input transaksi baru
    const [buyerName, setBuyerName] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [location, setLocation] = useState("");
    const [gudang, setGudang] = useState("");

    // useEffect akan berjalan saat komponen dimuat atau user berubah
    useEffect(() => {
        if (user) { // Pastikan user sudah ada (sudah login)
            fetchTransactions(); // Ambil data transaksi
            fetchProducts(); // Ambil data produk
        }
    }, [user]); // Bergantung pada objek user

    // Fungsi untuk mengambil data transaksi dari backend
    const fetchTransactions = async () => {
        try {
            const res = await axios.get("/transactions", { withCredentials: true });
            setTransactions(res.data); // Simpan data transaksi ke state
        } catch (err) {
            console.error("Error fetching transactions:", err); // Log error
            alert(`Gagal mengambil data transaksi: ${err.response?.data?.message || err.message}`); // Tampilkan pesan error
        }
    };

    // Fungsi untuk mengambil data produk dari backend
    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products", { withCredentials: true });
            // Filter produk yang statusnya 'available' atau 'pending' saja
            setProducts(res.data.filter(p => p.status === 'available' || p.status === 'pending'));
        } catch (err) {
            console.error("Error fetching products:", err); // Log error
            alert(`Gagal mengambil data produk: ${err.response?.data?.message || err.message}`); // Tampilkan pesan error
        }
    };

    // Fungsi untuk menangani pembuatan transaksi baru
    const handleCreate = async (e) => {
        e.preventDefault(); // Mencegah refresh halaman
        // Hanya staff yang bisa membuat transaksi baru
        if (user && user.role !== 'staff') {
            alert("Hanya staff yang bisa membuat transaksi baru.");
            return;
        }

        try {
            const transaction_code = "TRX" + Date.now(); // Membuat kode transaksi unik
            // Mengirim request POST untuk membuat transaksi baru
            await axios.post("/transactions", {
                transaction_code,
                buyer_name: buyerName,
                product_id: productId,
                quantity: Number(quantity),
                location,
                status: "pending", // Status default transaksi baru adalah 'pending'
                gudang,
            }, { withCredentials: true });
            
            fetchTransactions(); // Refresh daftar transaksi setelah berhasil membuat
            // Reset form setelah transaksi berhasil dibuat
            setBuyerName("");
            setProductId("");
            setQuantity(1);
            setLocation("");
            setGudang("");
        } catch (err) {
            console.error("Error creating transaction:", err); // Log error
            alert(`Gagal membuat transaksi: ${err.response?.data?.message || err.message}`); // Tampilkan pesan error
        }
    };

    // Menampilkan pesan loading jika data user belum ada
    if (!user) return <p className="text-white text-center py-8">Loading...</p>;

    return (
        <div className="transaction-container">
            <h2 className="transaction-title">Daftar Transaksi</h2>

            {/* Form Buat Transaksi Baru (Hanya tampil untuk staff) */}
            {user.role === 'staff' && (
                <form onSubmit={handleCreate} className="transaction-form">
                    <h3 className="text-lg font-semibold mb-2 text-white">Buat Transaksi Baru (Hanya Staff)</h3>
                    <label>Nama Pembeli</label>
                    <input
                        type="text"
                        placeholder="Nama Pembeli"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="input"
                        required
                    />
                    <label>Pilih Produk</label>
                    <select
                        value={productId}
                        onChange={(e) => {
                            setProductId(e.target.value);
                            // Otomatis mengisi lokasi dan gudang berdasarkan produk yang dipilih
                            const selectedProduct = products.find(p => p.id === parseInt(e.target.value));
                            if (selectedProduct) {
                                setLocation(selectedProduct.location || '');
                                setGudang(selectedProduct.gudang || '');
                            } else {
                                setLocation('');
                                setGudang('');
                            }
                        }}
                        className="input"
                        required
                    >
                        <option value="">Pilih Produk</option>
                        {/* Menampilkan daftar produk yang tersedia */}
                        {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                                {prod.name} (Stok: {prod.stock})
                            </option>
                        ))}
                    </select>
                    <label>Jumlah</label>
                    <input
                        type="number"
                        min="1" // Minimal jumlah 1
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="input"
                        required
                    />
                    <label>Lokasi Transaksi</label>
                    <input
                        type="text"
                        placeholder="Lokasi Transaksi"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input"
                    />
                    <label>Gudang Transaksi</label>
                    <input
                        type="text"
                        placeholder="Gudang Transaksi"
                        value={gudang}
                        onChange={(e) => setGudang(e.target.value)}
                        className="input"
                    />
                    <button type="submit" className="btn">
                        Tambah Transaksi
                    </button>
                </form>
            )}

            {/* Tabel Daftar Transaksi */}
            <div className="transaction-table-container">
                <table className="transaction-table">
                    <thead className="transaction-table-header">
                        <tr>
                            <th>ID</th>
                            <th>Kode</th>
                            <th>Pembeli</th>
                            <th>Produk</th>
                            <th>Jumlah</th>
                            <th>Total</th>
                            <th>Lokasi</th>
                            <th>Gudang</th>
                            <th>Status</th>
                            <th>Oleh User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Menampilkan pesan jika tidak ada data transaksi */}
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="transaction-empty">
                                    Tidak ada data transaksi
                                </td>
                            </tr>
                        ) : (
                            // Mapping (mengulang) data transaksi untuk ditampilkan di tabel
                            transactions.map((trx) => (
                                <tr key={trx.id} className="transaction-row">
                                    <td>{trx.id}</td>
                                    <td>{trx.transaction_code}</td>
                                    <td>{trx.buyer_name}</td>
                                    <td>{trx.product?.name || "-"}</td> {/* Nama produk (jika ada) */}
                                    <td>{trx.quantity}</td>
                                    <td>Rp{trx.total_price?.toLocaleString() || 0}</td> {/* Format harga total */}
                                    <td>{trx.location || trx.product?.location || "-"}</td> {/* Lokasi transaksi/produk */}
                                    <td>{trx.gudang || trx.product?.gudang || "-"}</td> {/* Gudang transaksi/produk */}
                                    <td><span className={`status-${trx.status.toLowerCase()}`}>{trx.status}</span></td> {/* Status transaksi dengan styling */}
                                    <td>{trx.user?.name || "-"}</td> {/* Nama user yang membuat/mengupdate */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bagian footer halaman */}
            <footer className="transaction-footer">
                <p>© 2025 Ronaldo Luxury Car</p>
            </footer>
        </div>
    );
};

export default Transaction; // Mengekspor komponen Transaction