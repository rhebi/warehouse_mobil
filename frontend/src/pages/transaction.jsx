import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../css/transaction.css";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const transaction_code = "TRX" + Date.now();
      await axios.post("/transactions", {
        transaction_code,
        buyer_name: buyerName,
        product_id: productId, // ✅ gunakan product_id, bukan products
        quantity,
      });
      fetchTransactions();
      setBuyerName("");
      setProductId(""); // ✅ perbaikan typo
      setQuantity(1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="transaction-container">
      <h2 className="transaction-title">Transaksi</h2>

      {/* Form Tambah Transaksi */}
      <form onSubmit={handleCreate} className="transaction-form bg-gray-100 p-4 rounded mb-6 text-black">
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
          onChange={(e) => setProductId(e.target.value)}
          className="input mb-2 w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Pilih Produk</option>
          {products.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.name}
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
        <button type="submit" className="btn bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">
          Tambah
        </button>
      </form>

      {/* Tabel Daftar Transaksi */}
      <table className="transaction-table">
        <thead className="transaction-table-header">
          <tr>
            <th>ID</th>
            <th>Kode</th>
            <th>Pembeli</th>
            <th>Produk</th>
            <th>Jumlah</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="transaction-empty">
                Tidak ada data transaksi
              </td>
            </tr>
          ) : (
            transactions.map((trx) => (
              <tr key={trx.id} className="transaction-row">
                <td>{trx.id}</td>
                <td>{trx.transaction_code}</td>
                <td>{trx.buyer_name}</td>
                <td>{trx.product?.name || "-"}</td> {/* ✅ akses nama produk */}
                <td>{trx.quantity}</td>
                <td>Rp{trx.total_price?.toLocaleString() || 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <footer className="transaction-footer">
        <p>© 2025 Ronaldo Luxury Car</p>
      </footer>
    </div>
  );
};

export default Transaction;
