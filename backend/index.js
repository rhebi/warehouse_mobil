import express from "express"; // Mengimpor Express.js untuk membuat server web
import dotenv from "dotenv";   // Mengimpor dotenv untuk mengelola environment variables
import cookieParser from "cookie-parser"; // Mengimpor cookie-parser untuk parsing cookie
import cors from "cors";       // Mengimpor CORS untuk mengizinkan request dari origin berbeda
import db from "./config/database.js"; // Mengimpor koneksi database
import router from "./routes/index.js"; // Mengimpor semua definisi rute aplikasi
import initRelations from "./models/initRelations.js"; // Mengimpor fungsi untuk inisialisasi relasi antar model

// Memanggil fungsi untuk menginisialisasi relasi antar model di Sequelize
// Ini penting agar relasi Many-to-One, One-to-Many, dll. bisa bekerja
initRelations();

// Mengkonfigurasi dotenv agar environment variables dari file .env bisa diakses
dotenv.config();

const app = express(); // Membuat instance aplikasi Express

// Fungsi async untuk memulai server dan koneksi database
const startServer = async () => {
  try {
    // Mencoba melakukan autentikasi ke database
    await db.authenticate();
    console.log("Database Connected..."); // Pesan jika koneksi sukses
    // Baris di bawah ini adalah untuk sinkronisasi model dengan database (membuat/mengubah tabel)
    // Biasanya hanya dijalankan saat pengembangan, tidak di produksi
    // await db.sync({ alter: true }); // Berfungsi untuk membuat tabel menggunakan sequelize, dapat dinonaktifkan dan juga di aktifkan
  } catch (error) {
    console.error("DB init error:", error); // Menangkap dan menampilkan error jika koneksi gagal
  }

  // Menggunakan middleware CORS
  app.use(cors({
    credentials: true, // Mengizinkan pengiriman cookie lintas origin
    // Menentukan daftar origin yang diizinkan untuk mengakses API
    origin: ['http://localhost:5000', 'http://localhost:5173'] 
  }));
  app.use(express.json());       // Middleware untuk parsing body request JSON
  app.use(cookieParser());       // Middleware untuk parsing cookie dari request
  app.use(router);               // Menggunakan semua rute yang didefinisikan dalam 'router'

  // Menjalankan server Express di port 5000
  app.listen(5000, () => console.log("Server running at port 5000"));
};

// Memanggil fungsi untuk memulai server
startServer();