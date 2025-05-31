import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // AuthContext
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import LayoutHeader from "./component/LayoutHeader.jsx";
import Inventory from "./pages/inventoryManager.jsx";
import InventoryStaff from "./pages/inventoryStaff.jsx";
import Transaction from "./pages/transaction.jsx"; 
import Dashboard from "./pages/dashboard.jsx"

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes dengan header */}
      <Route element={<LayoutHeader />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Inventory Manager */}
        <Route
          path="/inventoryManager"
          element={
            user && user.role === "manager" ? (
              <Inventory />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Inventory Staff */}
        <Route
          path="/inventoryStaff"
          element={
            user && user.role === "staff" ? (
              <InventoryStaff />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Transaction (akses manager & staff) */}
        <Route
          path="/transaction"
          element={
            user && (user.role === "manager" || user.role === "staff") ? (
              <Transaction />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Route>

      {/* Redirect lainnya */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
