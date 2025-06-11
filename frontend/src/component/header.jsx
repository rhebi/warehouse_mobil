import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Hook untuk navigasi dan komponen Link
import { useAuth } from "../context/AuthContext"; // Mengimpor hook useAuth untuk data user dan fungsi logout

const Header = ({ isOpen, toggleSidebar }) => { // Menerima props isOpen dan toggleSidebar dari LayoutHeader
  const navigate = useNavigate(); // Hook untuk navigasi halaman
  const { user, logout } = useAuth(); // Mengambil data user dan fungsi logout dari AuthContext

  // Fungsi untuk menangani proses logout
  const handleLogout = async () => {
    try {
      await logout(); // Memanggil fungsi logout dari AuthContext
      navigate("/login"); // Mengarahkan user ke halaman login setelah logout
    } catch (err) {
      console.error("Logout error:", err); // Menampilkan error di console jika logout gagal
    }
  };

  // Daftar link navigasi khusus untuk role manager
  const managerLinks = [
    { to: "/inventoryManager", text: "Inventory Manager" },
    { to: "/transaction", text: "Transaction List" },
    { to: "/transaction-approval", text: "Approve Transactions" },
    { to: "/stock-movements", text: "Stock Movements" },
    { to: "/dashboard", text: "Dashboard" },
  ];

  // Daftar link navigasi khusus untuk role staff
  const staffLinks = [
    { to: "/inventoryStaff", text: "Inventory Staff" },
    { to: "/transaction", text: "Transaction List" },
    { to: "/dashboard", text: "Dashboard" },
  ];
  
  // Menentukan daftar link yang akan dirender berdasarkan role user yang login
  const linksToRender = user ? (user.role === 'manager' ? managerLinks : staffLinks) : [];

  return (
    <>
      {/* Overlay untuk mobile saat sidebar terbuka */}
      {isOpen && ( // Hanya tampil jika sidebar terbuka dan layar kecil (lg:hidden)
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar} // Menutup sidebar saat overlay diklik
        ></div>
      )}

      {/* Sidebar utama */}
      <aside
        // Kelas CSS untuk mengatur posisi, ukuran, warna, responsif, dan animasi sidebar
        className={`fixed top-0 left-0 h-full bg-black text-white p-4 z-50 transform 
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                   lg:translate-x-0 transition-transform duration-300 ease-in-out
                   lg:w-64 w-64 flex flex-col shadow-lg`} // flex flex-col penting untuk mt-auto (mendorong elemen ke bawah)
      >
        {/* Logo aplikasi di sidebar */}
        <div
          className="text-3xl font-bold italic mb-8 cursor-pointer text-center"
        >
          LOG
        </div>

        {/* Navigasi Menu */}
        <nav>
          <ul className="space-y-2"> {/* Diberi jarak antar menu (li) pakai space-y-2 */}
            {user && linksToRender.map(link => ( // Hanya render link jika user sudah login
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="block py-2 px-3 rounded hover:bg-gray-800 transition duration-200" // 'block' agar background saat hover jadi full width
                  onClick={toggleSidebar} // Menutup sidebar saat link diklik (untuk mobile)
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Pengguna & Logout/Login/Signup */}
        <div className="mt-auto pt-4 border-t border-gray-700"> {/* 'mt-auto' mendorong blok ini ke paling bawah sidebar */}
          {user ? ( // Tampilkan info user dan tombol logout jika sudah login
            <>
              <span className="block text-sm mb-3">Hello, {user.name}</span> {/* Menampilkan nama user */}
              <button
                onClick={() => {
                  handleLogout(); // Memanggil fungsi logout
                  if (isOpen) toggleSidebar(); // Menutup sidebar setelah logout (untuk mobile)
                }}
                className="w-full bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition duration-200 text-center"
              >
                Logout
              </button>
            </>
          ) : ( // Tampilkan tombol login/signup jika belum login
            <>
              <Link
                to="/login"
                className="block w-full bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition duration-200 mb-2 text-center"
                onClick={toggleSidebar} // Menutup sidebar saat link diklik
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full bg-green-600 px-3 py-2 rounded hover:bg-green-700 transition duration-200 text-center"
                onClick={toggleSidebar} // Menutup sidebar saat link diklik
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Header; // Mengekspor komponen Header