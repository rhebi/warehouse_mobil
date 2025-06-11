import { createContext, useContext, useEffect, useState } from "react"; // Mengimpor React Hooks dan createContext
import axios from "../api/axios"; // Mengimpor instance Axios untuk komunikasi API

const AuthContext = createContext(); // Membuat Context baru untuk otentikasi

export const AuthProvider = ({ children }) => { // Komponen Provider untuk menyediakan nilai konteks
    const [user, setUser] = useState(null); // State untuk menyimpan data user yang login (null jika belum login)
    const [isLoading, setIsLoading] = useState(true); // State untuk menunjukkan apakah data user sedang dimuat

    // Fungsi untuk mendapatkan accessToken baru (biasanya dari refresh token di backend)
    const getNewAccessToken = async () => {
        try {
            const res = await axios.get("/token", { withCredentials: true }); // Request untuk mendapatkan token baru
            const accessToken = res.data.accessToken; // Mengambil accessToken dari respons
            // Menambahkan accessToken ke header default Axios untuk semua request selanjutnya (otentikasi bearer token)
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            return accessToken; // Mengembalikan accessToken
        } catch (err) {
            console.error("Gagal refresh token:", err); // Log error jika gagal refresh token
            logout(); // Jika refresh token gagal, anggap sesi tidak valid dan paksa logout
            return null; // Mengembalikan null jika gagal
        }
    };

    // Fungsi untuk mendapatkan data user yang sedang login dari backend
    const getUser = async () => {
        setIsLoading(true); // Set loading jadi true saat mulai fetch data user
        try {
            const token = await getNewAccessToken(); // Coba dapatkan accessToken baru
            if (!token) {
                // Jika tidak ada token (misal karena refresh gagal), setUser(null) sudah dilakukan di getNewAccessToken
                return;
            }

            const res = await axios.get("/me"); // Request ke endpoint /me untuk mendapatkan detail user
            setUser(res.data); // Menyimpan data user ke state
        } catch (err) {
            console.error("Gagal ambil user data dari /me:", err); // Log error jika gagal ambil data user
            setUser(null); // Pastikan user di-set null jika request /me gagal
        } finally {
            setIsLoading(false); // Set loading jadi false setelah proses selesai (baik sukses maupun gagal)
        }
    };

    // Fungsi untuk logout user
    const logout = async () => {
        try {
            await axios.delete("/logout", { withCredentials: true }); // Mengirim request logout ke backend
        } catch (err) {
            console.error("Logout gagal di server:", err); // Log error jika logout gagal di server
        } finally {
            // Selalu reset state user dan hapus header Authorization di sisi client
            setUser(null);
            delete axios.defaults.headers.common["Authorization"];
            setIsLoading(false); // Pastikan juga set loading false saat logout
            console.log("Client-side logout complete.");
        }
    };

    // useEffect akan berjalan sekali saat komponen dimuat untuk mencoba mendapatkan data user awal
    useEffect(() => {
        getUser();
    }, []); // Array dependensi kosong, berarti hanya dijalankan sekali saat komponen mount

    return (
        // AuthContext.Provider menyediakan nilai user, setUser, logout, dan isLoading ke semua komponen anak
        <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
            {children} {/* children adalah komponen-komponen lain yang dibungkus oleh AuthProvider */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); // Hook kustom untuk memudahkan penggunaan AuthContext