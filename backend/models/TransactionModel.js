import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Transaction = db.define("transactions", {
    transaction_code: DataTypes.STRING,
    buyer_name: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    total_price: DataTypes.BIGINT,
    user_id: DataTypes.INTEGER, // User yang membuat transaksi
    location: { // Tambahkan field location dan status ke transaksi
        type: DataTypes.STRING,
        allowNull: true, // Bisa null jika tidak relevan atau diambil dari produk
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'), // Status transaksi
        defaultValue: 'pending',
    },
    gudang: { // Tambahkan field gudang ke transaksi
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true
});

export default Transaction;