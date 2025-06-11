import { Sequelize } from "sequelize"; // Mengimpor Sequelize, ORM untuk Node.js

// Membuat instance Sequelize untuk koneksi ke database MySQL
const db = new Sequelize('warehouse_db', 'root', '', {
    host: "localhost", // Host database (biasanya localhost)
    dialect: "mysql"   // Jenis database yang digunakan (MySQL)
});

export default db; // Mengekspor instance database