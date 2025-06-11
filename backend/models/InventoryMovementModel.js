// // Import tipe data dan koneksi database
import { DataTypes } from "sequelize";
import db from "../config/database.js";

// // Mendefinisikan model 'InventoryMovement' yang akan menjadi tabel 'inventory_movements'
const InventoryMovement = db.define("inventory_movements", {
    // // Kolom untuk ID produk yang stoknya bergerak
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false // // Tidak boleh kosong
    },
    // // Kolom untuk jumlah stok yang bergerak
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    // // Kolom untuk tipe pergerakan stoknya
    type: {
        // // Pilihan: barang masuk, barang keluar, penyesuaian stok, atau transfer antar gudang
        type: DataTypes.ENUM('inbound', 'outbound', 'adjustment', 'transfer'),
        allowNull: false // // Tidak boleh kosong
    },
    // // Kolom untuk alasan pergerakan stok, misalnya 'pembelian', 'retur', 'rusak', 'koreksi stok opname'
    reason: {
        type: DataTypes.STRING,
        allowNull: true // // Boleh kosong
    },
    // // Kolom untuk ID user yang mencatat pergerakan ini
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // // Kolom untuk lokasi asal barang
    location_from: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    // // Kolom untuk lokasi tujuan barang
    location_to: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // // Kolom untuk catatan tambahan
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    // // Nama tabelnya 'inventory_movements'
    freezeTableName: true
});

// // Export model InventoryMovement
export default InventoryMovement;