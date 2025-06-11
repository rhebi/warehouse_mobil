import { Routes, Route, Navigate } from "react-router-dom"; // Mengimpor komponen routing dari React Router DOM
import { useAuth } from "./context/AuthContext"; // Mengimpor hook useAuth untuk status otentikasi
// Mengimpor semua komponen halaman yang berbeda
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import LayoutHeader from "./component/LayoutHeader.jsx"; // Layout yang sudah termasuk sidebar
import Inventory from "./pages/inventoryManager.jsx";
import InventoryStaff from "./pages/inventoryStaff.jsx";
import Transaction from "./pages/transaction.jsx";
import Dashboard from "./pages/dashboard.jsx";
import TransactionApprovalManager from "./pages/transactionApprovalManager.jsx";
import StockMovement from "./pages/stockMovement.jsx";

function App() {
  const { user, isLoading } = useAuth(); // Mengambil data user dan status loading dari AuthContext

  // Menampilkan layar loading jika data user masih dimuat
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl">
        Loading user data...
      </div>
    );
  }

  return (
    <Routes> {/* Komponen utama untuk mendefinisikan rute */}
      {/* RUTE PUBLIK (TIDAK PAKAI SIDEBAR)
        Rute ini bisa diakses tanpa login.
        Kalau user sudah login, arahkan ke dashboard. Jika belum, tampilkan halamannya.
      */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />} // Jika user ada, redirect ke /dashboard, kalau tidak, tampilkan Login
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" /> : <Signup />} // Jika user ada, redirect ke /dashboard, kalau tidak, tampilkan Signup
      />

      {/* RUTE TERPROTEKSI (WAJIB LOGIN & PAKAI SIDEBAR)
        Semua rute di dalam <Route element={...}> ini akan menggunakan LayoutHeader dan
        hanya bisa diakses jika user sudah login.
        Jika user belum login, semua rute di dalam sini akan mengarahkan ke /login.
      */}
      <Route element={user ? <LayoutHeader /> : <Navigate to="/login" />}>
        {/* Rute Dashboard, bisa diakses oleh semua role user yang login */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Inventory Manager - Hanya bisa diakses oleh user dengan role "manager" */}
        <Route
          path="/inventoryManager"
          element={user?.role === "manager" ? <Inventory /> : <Navigate to="/dashboard" />} // Jika bukan manager, redirect ke dashboard
        />

        {/* Inventory Staff - Hanya bisa diakses oleh user dengan role "staff" */}
        <Route
          path="/inventoryStaff"
          element={user?.role === "staff" ? <InventoryStaff /> : <Navigate to="/dashboard" />} // Jika bukan staff, redirect ke dashboard
        />

        {/* Rute Transaksi untuk Manager (Validasi) - Hanya untuk manager */}
        <Route
          path="/transaction-approval"
          element={user?.role === "manager" ? <TransactionApprovalManager /> : <Navigate to="/dashboard" />} // Jika bukan manager, redirect ke dashboard
        />

        {/* Rute Stock Movements (Hanya untuk Manager) */}
        <Route
          path="/stock-movements"
          element={user?.role === "manager" ? <StockMovement /> : <Navigate to="/dashboard" />} // Jika bukan manager, redirect ke dashboard
        />

        {/* Transaction (akses manager & staff) - Bisa diakses oleh manager atau staff */}
        <Route
          path="/transaction"
          element={(user?.role === "manager" || user?.role === "staff") ? <Transaction /> : <Navigate to="/dashboard" />} // Jika bukan manager/staff, redirect ke dashboard
        />
      </Route>

      {/* Redirect lainnya
        Jika user mengakses rute yang tidak terdefinisi (misal: URL salah),
        aplikasi akan mengarahkan ke halaman login (jika belum login) atau dashboard (jika sudah login).
      */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App; // Mengekspor komponen App