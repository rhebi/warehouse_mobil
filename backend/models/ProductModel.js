import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Product = db.define("products", {
    name: DataTypes.STRING,
    model: DataTypes.STRING,
    price: DataTypes.BIGINT,
    description: DataTypes.TEXT,
    location: {
        type: DataTypes.STRING,
        defaultValue: 'Gudang A'
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('available', 'maintenance', 'sold', 'pending', 'rejected'), // Tambahkan 'pending' dan 'rejected' untuk alur approval
        defaultValue: 'available' // Bisa diubah ke 'pending' jika ada review awal
    },
    gudang: {
        type: DataTypes.STRING,
        defaultValue: "Gudang A"
    },
    // Ubah tipe data menjadi INTEGER agar sesuai dengan userId
    updatedBy: {
        type: DataTypes.INTEGER, // Akan menyimpan ID dari UserModel
        allowNull: true // Bisa null jika produk di-import tanpa user
    }
}, {
    freezeTableName: true
});

export default Product;