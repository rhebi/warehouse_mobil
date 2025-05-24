import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // AuthContext
import Home from "./pages/home.jsx";
import Signup from "./pages/signup.jsx";
import About from "./pages/about.jsx";
import Car from "./pages/car.jsx";
import Contact from "./pages/contact.jsx";
import Login from "./pages/login.jsx";
import LayoutHeader from "./component/LayoutHeader.jsx";
import Dashboard from "./pages/dashboard_manager.jsx";
import DashboardStaff from "./pages/dashboard_staff.jsx";
import Transaction from "./pages/transaction.jsx"; 

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes dengan header */}
      <Route element={<LayoutHeader />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/car" element={<Car />} />
        <Route path="/contact" element={<Contact />} />

        {/* Dashboard Manager */}
        <Route
          path="/dashboardManager"
          element={
            user && user.role === "manager" ? (
              <Dashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Dashboard Staff */}
        <Route
          path="/dashboardStaff"
          element={
            user && user.role === "staff" ? (
              <DashboardStaff />
            ) : (
              <Navigate to="/" />
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
              <Navigate to="/" />
            )
          }
        />
      </Route>

      {/* Routes tanpa header */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Redirect lainnya */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
