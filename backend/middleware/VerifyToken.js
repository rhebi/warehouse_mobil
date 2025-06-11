import jwt from "jsonwebtoken"; // Mengimpor library jsonwebtoken untuk bekerja dengan JWT

// Middleware untuk memverifikasi token JWT
export const verifytoken = (req, res, next) => {
  // Mengambil header 'Authorization' dari request
  // Formatnya biasanya "Bearer <token>"
  const authHeader = req.headers["authorization"];
  // Memisahkan string "Bearer " untuk mendapatkan token saja
  const token = authHeader && authHeader.split(" ")[1];
  // Jika token tidak ada, kirim respons 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ msg: "Token tidak ditemukan" });
  }

  // Memverifikasi token menggunakan secret key dari environment variables
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // Jika ada error saat verifikasi (misal: token expired, tidak valid)
    if (err) {
      return res.status(403).json({ msg: "Token tidak valid atau expired" });
    }
    // Menampilkan hasil dekode JWT di console (berguna untuk debugging)
    console.log("Decoded JWT:", decoded);
    // Menyimpan informasi user yang didekode ke objek `req.user`
    // Informasi ini kemudian bisa diakses oleh middleware/handler berikutnya (misal: `isManager`, `isStaff`)
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role, 
      updatedBy: decoded.updatedBy,
    };
    // Lanjutkan ke middleware/handler berikutnya
    next();
  });
};