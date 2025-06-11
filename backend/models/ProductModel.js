// // Import tipe data dari Sequelize
import { DataTypes } from "sequelize";
// // Import koneksi database
import db from "../config/database.js";

// // Mendefinisikan model 'Product' yang akan menjadi tabel 'products' di database
const Product = db.define("products", {
    // // Kolom untuk nama produk, tipe datanya String (teks)
    name: DataTypes.STRING,
    // // Kolom untuk model produk, tipe datanya String
    model: DataTypes.STRING,
    // // Kolom untuk harga, BIGINT untuk menampung angka yang besar
    price: DataTypes.BIGINT,
    // // Kolom untuk deskripsi produk, TEXT untuk teks yang panjang
    description: DataTypes.TEXT,
    // // Kolom untuk lokasi produk
    location: {
        type: DataTypes.STRING,
        defaultValue: 'Gudang A' // // Jika tidak diisi, nilainya otomatis 'Gudang A'
    },
    // // Kolom untuk jumlah stok produk
    stock: {
        type: DataTypes.INTEGER, // // Tipe datanya Integer (angka bulat)
        defaultValue: 0 // // Jika tidak diisi, stok otomatis 0
    },
    // // Kolom untuk status produk
    status: {
        // // Tipe ENUM artinya nilainya hanya boleh salah satu dari daftar ini
        type: DataTypes.ENUM('available', 'maintenance', 'sold', 'pending', 'rejected'),
        defaultValue: 'available' // // Status default saat produk dibuat
    },
    // // Kolom untuk nama gudang
    gudang: {
        type: DataTypes.STRING,
        defaultValue: "Gudang A"
    },
    // // Kolom untuk menyimpan ID user yang terakhir kali mengupdate produk ini
    updatedBy: {
        type: DataTypes.INTEGER, // // Harus Integer karena akan menyimpan ID dari tabel User
        allowNull: true // // Boleh kosong (null)
    }
}, {
    // // Opsi ini membuat nama tabel di database sama persis dengan nama model ('products'),
    // // tidak diubah otomatis menjadi jamak oleh Sequelize.
    freezeTableName: true
});

// // Export model ini agar bisa digunakan di file lain
export default Product;