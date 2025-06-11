// Middleware untuk memeriksa role user
// Middleware adalah fungsi yang berjalan sebelum request utama diproses
// Tujuannya untuk memverifikasi apakah user punya akses ke resource tertentu

export const isManager = (req, res, next) => {
  // Mengambil role user dari objek `req.user`
  // Objek `req.user` ini biasanya diisi oleh middleware `verifytoken` setelah token berhasil didekode
  const userRole = req.user.role; 
  // Jika role user bukan 'manager', kirim respons 403 (Forbidden)
  if (userRole !== "manager") {
    return res.status(403).json({ msg: "Akses hanya untuk manager" });
  }
  // Jika role sesuai, lanjutkan ke middleware/handler berikutnya
  next();
};

export const isStaff = (req, res, next) => {
  const userRole = req.user.role;
  // Jika role user bukan 'staff', kirim respons 403 (Forbidden)
  if (userRole !== "staff") {
    return res.status(403).json({ msg: "Akses hanya untuk staff" });
  }
  // Jika role sesuai, lanjutkan ke middleware/handler berikutnya
  next();
};

export const isManagerOrStaff = (req, res, next) => {
  const userRole = req.user.role;
  // Jika role user adalah 'manager' ATAU 'staff', lanjutkan
  if (userRole === "manager" || userRole === "staff") {
    next();
  } else {
    // Jika role tidak sesuai, kirim respons 403 (Forbidden)
    return res.status(403).json({ msg: "Akses hanya untuk staff atau manager" });
  }
};