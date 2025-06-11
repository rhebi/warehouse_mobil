import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // Mengimpor instance Axios untuk komunikasi API
import { useAuth } from "../context/AuthContext"; // Mengimpor AuthContext untuk mendapatkan data user
import "../css/approve.css"; // Mengimpor CSS khusus untuk halaman approval (sudah disesuaikan namanya)

const TransactionApprovalManager = () => {
    const { user } = useAuth(); // Mendapatkan data user yang sedang login
    const [pendingTransactions, setPendingTransactions] = useState([]); // State untuk menyimpan daftar transaksi pending
    const [loading, setLoading] = useState(true); // State untuk indikator loading
    const [error, setError] = useState(null); // State untuk menyimpan pesan error

    // useEffect akan berjalan saat komponen dimuat atau user berubah
    useEffect(() => {
        // Hanya manager yang bisa mengakses dan mengambil data transaksi pending
        if (user?.role === 'manager') {
            fetchPendingTransactions(); // Ambil data transaksi pending
        } else {
            setLoading(false); // Kalau bukan manager, set loading false aja
        }
    }, [user]); // Bergantung pada objek user

    // Fungsi untuk mengambil data transaksi yang statusnya 'pending' dari backend
    const fetchPendingTransactions = async () => {
        setLoading(true); // Set loading jadi true
        setError(null); // Reset error
        try {
            const res = await axios.get("/transactions/pending", { withCredentials: true });
            setPendingTransactions(res.data); // Simpan data transaksi pending ke state
        } catch (err) {
            console.error("Error fetching pending transactions:", err); // Log error
            setError(`Gagal mengambil transaksi pending: ${err.response?.data?.message || err.message}`); // Set pesan error
            setPendingTransactions([]); // Kosongkan data jika gagal
        } finally {
            setLoading(false); // Set loading jadi false setelah selesai (sukses/gagal)
        }
    };

    // Fungsi untuk menangani approve (menyetujui) transaksi
    const handleApprove = async (id) => {
        // Konfirmasi ke user sebelum approve
        if (!window.confirm("Yakin ingin MENGAPPROVE transaksi ini?")) return;
        try {
            // Mengirim request PATCH untuk mengubah status transaksi menjadi 'approved'
            await axios.patch(`/transactions/${id}/approve`, {}, { withCredentials: true });
            alert("Transaksi berhasil diapprove!"); // Tampilkan notifikasi sukses
            fetchPendingTransactions(); // Refresh daftar transaksi pending
        } catch (err) {
            console.error("Error approving transaction:", err); // Log error
            alert(`Gagal approve transaksi: ${err.response?.data?.message || err.message}`); // Tampilkan pesan error
        }
    };

    // Fungsi untuk menangani reject (menolak) transaksi
    const handleReject = async (id) => {
        // Konfirmasi ke user sebelum reject
        if (!window.confirm("Yakin ingin MEREJECT transaksi ini?")) return;
        try {
            // Mengirim request PATCH untuk mengubah status transaksi menjadi 'rejected'
            await axios.patch(`/transactions/${id}/reject`, {}, { withCredentials: true });
            alert("Transaksi berhasil direject!"); // Tampilkan notifikasi sukses
            fetchPendingTransactions(); // Refresh daftar transaksi pending
        } catch (err) {
            console.error("Error rejecting transaction:", err); // Log error
            alert(`Gagal reject transaksi: ${err.response?.data?.message || err.message}`); // Tampilkan pesan error
        }
    };

    // Menampilkan pesan loading jika data sedang dimuat
    if (loading) return <p className="text-white text-center py-8">Lagi loading transaksi pending...</p>;
    // Menampilkan pesan error jika terjadi kesalahan
    if (error) return <p className="text-red-500 text-center py-8">{error}</p>;
    // Menampilkan pesan akses ditolak jika user bukan manager
    if (!user || user.role !== 'manager') return <p className="text-red-500 text-center py-8">Maaf, halaman ini cuma buat manajer ya.</p>;

    return (
        <div className="approval-container"> {/* Container utama halaman approval */}
            <h2 className="approval-title">Validasi Transaksi</h2> {/* Judul halaman */}

            <div className="approval-table-container"> {/* Container untuk tabel */}
                <table className="approval-table"> {/* Tabel untuk menampilkan transaksi pending */}
                    <thead className="approval-table-header">
                        <tr>
                            <th>ID</th>
                            <th>Kode</th>
                            <th>Pembeli</th>
                            <th>Produk</th>
                            <th>Jumlah</th>
                            <th>Total</th>
                            <th>Lokasi</th>
                            <th>Gudang</th>
                            <th>Oleh User</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Menampilkan pesan jika tidak ada transaksi pending */}
                        {pendingTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="approval-empty">
                                    Belum ada transaksi pending yang perlu divalidasi.
                                </td>
                            </tr>
                        ) : (
                            // Mapping (mengulang) data transaksi pending untuk ditampilkan di tabel
                            pendingTransactions.map((trx) => (
                                <tr key={trx.id} className="approval-row">
                                    <td>{trx.id}</td>
                                    <td>{trx.transaction_code}</td>
                                    <td>{trx.buyer_name}</td>
                                    <td>{trx.product?.name || "-"}</td>
                                    <td>{trx.quantity}</td>
                                    <td>Rp{trx.total_price?.toLocaleString() || 0}</td>
                                    <td>{trx.location || trx.product?.location || "-"}</td>
                                    <td>{trx.gudang || trx.product?.gudang || "-"}</td>
                                    <td>{trx.user?.name || "-"}</td>
                                    <td>
                                        {/* Tombol Approve dan Reject */}
                                        <div className="flex gap-2"> {/* Menggunakan flexbox untuk mengatur jarak tombol */}
                                            <button
                                                onClick={() => handleApprove(trx.id)}
                                                className="btn-approve-custom" // Styling khusus untuk tombol approve
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(trx.id)}
                                                className="btn-reject-custom" // Styling khusus untuk tombol reject
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bagian footer halaman */}
            <footer className="approval-footer">
                <p>© 2025 Ronaldo Luxury Car</p>
            </footer>
        </div>
    );
};

export default TransactionApprovalManager; // Mengekspor komponen TransactionApprovalManager