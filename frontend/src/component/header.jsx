import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black text-white flex justify-between items-center p-4 z-50 shadow-md">
      <div
        className="text-2xl font-bold italic cursor-pointer"
        onClick={() => navigate("/")}
      >
        LOG
      </div>

      <nav className="flex space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/car" className="hover:underline">Our Cars</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
        {user && user.role === "manager" && (
          <Link to="/dashboardManager" className="hover:underline">Dashboard</Link>
        )}
        {user && user.role === "staff" && (
          <Link to="/dashboardStaff" className="hover:underline">Dashboard</Link>
        )}
      </nav>

      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 mr-2"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
