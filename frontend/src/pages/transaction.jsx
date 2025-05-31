import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../css/transaction.css";

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [buyerName, setBuyerName] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [location, setLocation] = useState(""); // State untuk location
    const [status, setStatus] = useState("pending"); // State untuk status transaksi
    const [gudang, setGudang] = useState(""); // State untuk gudang

    useEffect(() => {
        fetchTransactions();
        fetchProducts();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get("/transactions", { withCredentials: true });
            setTransactions(res.data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            alert(`Gagal mengambil data transaksi: ${err.response?.data?.message || err.message}`);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products", { withCredentials: true });
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products:", err);
            alert(`Gagal mengambil data produk: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const transaction_code = "TRX" + Date.now();
            await axios.post("/transactions", {
                transaction_code,
                buyer_name: buyerName,
                product_id: productId,
                quantity: Number(quantity), // Pastikan quantity number
                location, // Kirim location
                status,    // Kirim status
                gudang,    // Kirim gudang
            }, { withCredentials: true });
            fetchTransactions();
            // Reset form
            setBuyerName("");
            setProductId("");
            setQuantity(1);
            setLocation("");
            setStatus("pending");
            setGudang("");
        } catch (err) {
            console.error("Error creating transaction:", err);
            alert(`Gagal membuat transaksi: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="transaction-container text-black"> {/* text-black di sini mungkin tidak terlalu berpengaruh karena akan ditimpa di level yang lebih dalam oleh kelas di CSS atau di elemen itu sendiri. */}
            <h2 className="transaction-title text-white">Transaksi</h2>

            {/* Form Tambah Transaksi */}
            <form onSubmit={handleCreate} className="transaction-form bg-gray-100 p-4 rounded mb-6">
                <h3 className="text-lg font-semibold mb-2">Tambah Transaksi</h3>
                <input
                    type="text"
                    placeholder="Nama Pembeli"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="input mb-2 w-full px-3 py-2 border rounded"
                    required
                />
                <select
                    value={productId}
                    onChange={(e) => {
                        setProductId(e.target.value);
                        // Optional: Set default location/gudang dari produk yang dipilih
                        const selectedProduct = products.find(p => p.id === parseInt(e.target.value));
                        if (selectedProduct) {
                            setLocation(selectedProduct.location || '');
                            setGudang(selectedProduct.gudang || '');
                        } else {
                            setLocation('');
                            setGudang('');
                        }
                    }}
                    className="input mb-2 w-full px-3 py-2 border rounded"
                    required
                >
                    <option value="">Pilih Produk</option>
                    {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                            {prod.name} (Stok: {prod.stock})
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input mb-2 w-full px-3 py-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Lokasi Transaksi (Opsional)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input mb-2 w-full px-3 py-2 border rounded"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input mb-2 w-full px-3 py-2 border rounded"
                    required
                >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                </select>
                <input
                    type="text"
                    placeholder="Gudang Transaksi (Opsional)"
                    value={gudang}
                    onChange={(e) => setGudang(e.target.value)}
                    className="input mb-2 w-full px-3 py-2 border rounded"
                />
                <button type="submit" className="btn bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">
                    Tambah Transaksi
                </button>
            </form>

            {/* Tabel Daftar Transaksi */}
            <table className="transaction-table bg-gray-100">
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
                        {/* <th>Aksi</th> */}
                    </tr>
                </thead>
                <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="transaction-empty">
                                Tidak ada data transaksi
                            </td>
                        </tr>
                    ) : (
                        transactions.map((trx) => (
                            <tr key={trx.id} className="transaction-row">
                                <td>{trx.id}</td>
                                <td>{trx.transaction_code}</td>
                                <td>{trx.buyer_name}</td>
                                <td>{trx.product?.name || "-"}</td>
                                <td>{trx.quantity}</td>
                                <td>Rp{trx.total_price?.toLocaleString() || 0}</td>
                                <td>{trx.location || trx.product?.location || "-"}</td> {/* Tampilkan lokasi transaksi atau dari produk */}
                                <td>{trx.gudang || trx.product?.gudang || "-"}</td> {/* Tampilkan gudang transaksi atau dari produk */}
                                <td><span className={`status-${trx.status.toLowerCase()}`}>{trx.status}</span></td>
                                <td>{trx.user?.name || "-"}</td> {/* Ini adalah bagian yang paling penting untuk diperiksa */}
                                {/* <td>
                                    <button className="btn-edit">Edit</button>
                                    <button className="btn-delete ml-2">Hapus</button>
                                </td> */}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <footer className="transaction-footer mt-6 text-center text-white">
                <p>© {new Date().getFullYear()} 2025 Ronaldo Luxury Car</p>
            </footer>
        </div>
    );
};

export default Transaction;