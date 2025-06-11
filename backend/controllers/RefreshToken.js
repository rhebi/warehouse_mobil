// // Import model User dan library jwt
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// // Fungsi untuk memperbarui (refresh) access token
export const refreshToken = async (req, res) => {
    try {
        // // Ambil refresh token dari httpOnly cookie yang dikirim browser
        const refreshToken = req.cookies.refreshToken;
        // // Jika tidak ada refresh token, user harus login ulang (Unauthorized)
        if (!refreshToken) return res.sendStatus(401); 
        
        // // Verifikasi refresh token menggunakan secret key
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
            // // Jika verifikasi gagal (token tidak valid atau expired), kirim error Forbidden
            if (err) {
                return res.sendStatus(403); 
            }
            // // Cari user di database berdasarkan ID yang ada di dalam token yang sudah di-decode
            const user = await Users.findOne({
                where: { id: decode.userId }
            });
            // // Jika user tidak ada ATAU refresh token dari browser tidak cocok dengan yang di database,
            // // ini bisa jadi tanda penyalahgunaan, jadi tolak aksesnya.
            if (!user || user.refresh_token !== refreshToken) { 
                return res.sendStatus(403);
            }
            // // Jika semua aman, siapkan data user untuk membuat access token baru
            const userId = user.id;
            const name = user.name;
            const email = user.email;
            const role = user.role;
            // // Buat access token yang baru dengan masa berlaku singkat
            const accessToken = jwt.sign(
                { userId, name, email, role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '45m' }
            );
            // // Kirim access token baru ke frontend
            res.json({ accessToken });
        });
    } catch (error) {
        // // Tangani jika ada error di server
        res.status(500).json({ msg: "Server error during refresh token" });
    }
};