// // Import tipe data dari Sequelize dan koneksi database
import { DataTypes } from "sequelize";
import db from "../config/database.js";

// // Mendefinisikan model 'Transaction' yang akan menjadi tabel 'transactions'
const Transaction = db.define("transactions", {
    // // Kolom untuk kode transaksi yang unik
    transaction_code: DataTypes.STRING,
    // // Kolom untuk nama pembeli
    buyer_name: DataTypes.STRING,
    // // Kolom untuk ID produk yang dibeli
    product_id: DataTypes.INTEGER,
    // // Kolom untuk jumlah barang yang dibeli
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // // Jika tidak diisi, otomatis dianggap 1
    },
    // // Kolom untuk total harga transaksi
    total_price: DataTypes.BIGINT,
    // // Kolom untuk ID user yang membuat transaksi ini
    user_id: DataTypes.INTEGER,
    // // Kolom untuk lokasi transaksi
    location: {
        type: DataTypes.STRING,
        allowNull: true, // // Boleh kosong
    },
    // // Kolom untuk status transaksi
    status: {
        // // Pilihannya: menunggu, disetujui, ditolak, atau selesai
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending', // // Status default saat transaksi dibuat
    },
    // // Kolom untuk gudang tempat transaksi terjadi
    gudang: {
        type: DataTypes.STRING,
        allowNull: true, // // Boleh kosong
    }
}, {
    // // Nama tabelnya 'transactions'
    freezeTableName: true
});

// // Export model Transaction
export default Transaction;