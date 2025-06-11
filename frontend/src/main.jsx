import { StrictMode } from 'react'; // Mengimpor StrictMode dari React untuk membantu mendeteksi masalah di aplikasi
import { createRoot } from 'react-dom/client'; // Mengimpor createRoot untuk merender aplikasi React
import App from './App.jsx'; // Mengimpor komponen utama aplikasi (App)
import './index.css'; // Mengimpor file CSS global (biasanya berisi Tailwind CSS)
import { AuthProvider } from "../src/context/AuthContext.jsx"; // Mengimpor AuthProvider untuk menyediakan konteks otentikasi
import { BrowserRouter } from "react-router-dom"; // Mengimpor BrowserRouter untuk mengaktifkan routing berbasis URL

// Mendapatkan elemen root dari DOM (biasanya <div id="root"> di index.html)
createRoot(document.getElementById("root")).render(
  // StrictMode: Membantu mendeteksi masalah potensial dalam aplikasi selama pengembangan
  <StrictMode>
    {/* BrowserRouter: Memungkinkan aplikasi menggunakan fitur routing (URL) */}
    <BrowserRouter>
      {/* AuthProvider: Menyediakan state dan fungsi otentikasi (user, logout) ke seluruh komponen di dalamnya */}
      <AuthProvider>
        <App /> {/* Komponen utama aplikasi yang berisi semua rute dan halaman */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);