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
            // Jika refresh token gagal, sesi tidak valid, langsung logout user
            logout(); // Panggil fungsi logout untuk membersihkan sesi
            return null;
        }
    };

    const getUser = async () => {
        try {
            const token = await getNewAccessToken();
            if (!token) {
                // Jika tidak ada token (misal karena refresh gagal), setUser(null) sudah dilakukan di getNewAccessToken
                return;
            }

            const res = await axios.get("/me");
            setUser(res.data);
        } catch (err) {
            console.error("Gagal ambil user data dari /me:", err);
            setUser(null); // Pastikan user di-set null jika /me gagal
        }
    };

    const logout = async () => {
        try {
            await axios.delete("/logout", { withCredentials: true });
        } catch (err) {
            console.error("Logout gagal di server:", err);
        } finally {
            // Selalu reset state user dan hapus header Authorization di client
            setUser(null);
            delete axios.defaults.headers.common["Authorization"];
            console.log("Client-side logout complete.");
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