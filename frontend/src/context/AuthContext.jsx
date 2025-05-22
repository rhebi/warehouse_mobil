import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  const getNewAccessToken = async () => {
    try {
      const res = await axios.get("/token", { withCredentials: true });
      const accessToken = res.data.accessToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      return accessToken;
    } catch (err) {
      console.error("Gagal refresh token:", err);
      return null;
    }
  };

  const getUser = async () => {
    try {
      const token = await getNewAccessToken(); 
      if (!token) {
        setUser(null);
        return;
      }

      const res = await axios.get("/me");
      setUser(res.data);
    } catch (err) {
      console.error("Gagal ambil user:", err);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axios.delete("/logout", { withCredentials: true });
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  useEffect(() => {
    getUser(); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
