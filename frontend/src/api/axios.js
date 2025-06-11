import axios from "axios";

// Membuat instance Axios dengan konfigurasi dasar
const instance = axios.create({
  baseURL: "http://localhost:5000", // URL dasar untuk semua request ke backend
  withCredentials: true, // Mengizinkan pengiriman cookies bersama request (penting untuk otentikasi)
});

// Interceptor yang ngambil dari localStorage udah aku hapus
// (Ini catatan dari kamu, bagus untuk ingetin perubahan)

export default instance; // Mengekspor instance Axios yang sudah dikonfigurasi