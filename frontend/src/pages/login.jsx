import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/signup.css";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await axios.post("/login", { email, password }, { withCredentials: true });
      const accessToken = loginRes.data.accessToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const meRes = await axios.get("/me");
      setUser(meRes.data);

      navigate("/"); 
    } catch (err) {
      console.error("Login error:", err);
      setMsg(err.response?.data?.msg || "Login gagal");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {msg && <p className="text-red-500 mb-2">{msg}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Belum punya akun?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
