// // Import Sequelize
import { Sequelize } from "sequelize";
// // Import koneksi database
import db from "../config/database.js";

const { DataTypes } = Sequelize;

// // Mendefinisikan model 'Users' yang akan menjadi tabel 'users'
const Users = db.define('users',{
    // // Kolom untuk nama user
    name:{
        type: DataTypes.STRING,
        allowNull: false // // Tidak boleh kosong
    },
    // // Kolom untuk email user
    email:{
        type: DataTypes.STRING,
        unique: true, // // Setiap email harus unik, tidak boleh ada yang sama
        allowNull: false // // Tidak boleh kosong
    },
    // // Kolom untuk password user
    password:{
        type: DataTypes.STRING,
        allowNull: false // // Tidak boleh kosong
    },
    // // Kolom untuk menyimpan refresh_token
    // // Ini dipakai agar user tidak perlu login ulang terus-menerus
    refresh_token:{
        type: DataTypes.TEXT
    },
    // // Kolom untuk role atau peran user
    role: { 
        type: DataTypes.ENUM("staff","manager"), // // Pilihannya hanya 'staff' atau 'manager'
        allowNull: false, // // Tidak boleh kosong
        defaultValue: "staff" // // Role default saat user baru mendaftar
    }
},{
    // // Nama tabelnya 'users'
    freezeTableName:true
})

// // Export model User
export default Users;