// src/component/LayoutHeader.jsx
import React, { useState } from "react";
import Header from "./header"; // Mengimpor komponen Header (sidebar)
import { Outlet } from "react-router-dom"; // Mengimpor Outlet dari React Router DOM untuk menampilkan konten rute anak

const LayoutHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk mengontrol status buka/tutup sidebar

  // Fungsi untuk toggle (mengubah status) sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Hamburger menu untuk mobile */}
      <button
        // Posisi tetap di atas kiri, hanya terlihat di layar kecil (lg:hidden)
        className="fixed top-4 left-4 z-50 p-2 rounded bg-gray-800 text-white lg:hidden"
        onClick={toggleSidebar} // Membuka/menutup sidebar saat diklik
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16" // Bentuk ikon hamburger
          ></path>
        </svg>
      </button>

      {/* Sidebar (komponen Header) */}
      <Header isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Meneruskan props ke komponen Header */}

      {/* Area konten utama */}
      <main
        // Kelas CSS untuk mengatur margin kiri (untuk memberi ruang sidebar), warna, tinggi minimal, dan animasi
        className={`bg-black text-white min-h-screen transition-all duration-300 ease-in-out
                   lg:ml-64`} // Margin kiri 64 unit di layar besar (lg:), agar konten tidak tertutup sidebar
      >
        {/* Div untuk padding konten (penting terutama untuk mobile agar tidak tertutup hamburger menu) */}
        <div className="pt-20 px-4 lg:pt-4"> {/* padding-top 20 unit untuk mobile, 4 unit untuk desktop */}
          <Outlet /> {/* Ini adalah tempat di mana konten dari rute anak akan dirender (misal: Dashboard, Inventory, dll) */}
        </div>
      </main>
    </>
  );
};

export default LayoutHeader; // Mengekspor komponen LayoutHeader