// // Import Express dan semua controller/router yang dibutuhkan
import express from "express";
import { getUser, Register, Login, Logout, getMe } from "../controllers/User.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager } from "../middleware/VerifyRole.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import DashboardRoute from "./DashboardRoute.js";
import ProductRoute from "./ProductRoute.js";
import TransactionRoute from "./TransactionRoute.js";
import InventoryMovementRoute from "./InventoryMovementRoute.js";

// // Buat instance router utama
const router = express.Router();

// // == PENGGABUNGAN SEMUA ROUTE ==
// // Logikanya: "Jika ada request ke URL yang diawali '/dashboard',
// // maka teruskan ke aturan yang ada di file DashboardRoute.js"
router.use("/dashboard", DashboardRoute);
// // "Jika request ke URL '/products', teruskan ke ProductRoute.js"
router.use("/products", ProductRoute);
// // "Jika request ke URL '/transactions', teruskan ke TransactionRoute.js"
router.use("/transactions", TransactionRoute);
// // "Jika request ke URL '/inventory-movements', teruskan ke InventoryMovementRoute.js"
router.use("/inventory-movements", InventoryMovementRoute);

// // == Route untuk User dan Autentikasi ==
// // Route ini didefinisikan langsung di sini karena tidak terlalu banyak
// // GET /users -> Melihat semua user (hanya Manager)
router.get('/users', verifytoken, isManager, getUser);
// // GET /me -> Melihat data diri sendiri (sesuai token yang login)
router.get('/me', verifytoken, getMe);
// // POST /users -> Mendaftarkan user baru (tidak perlu login)
router.post('/users', Register);
// // POST /login -> Proses login (tidak perlu login)
router.post('/login', Login);
// // GET /token -> Memperbarui access token (otomatis dipanggil dari frontend)
router.get('/token', refreshToken);
// // DELETE /logout -> Proses logout
router.delete('/logout', Logout);

// // Ini contoh route dummy untuk testing
router.get('/dashboard-manager', verifytoken, isManager, (req, res) => {
    res.json({ msg: "Selamat datang di dashboard manager!" });
});

// // Export router utama ini untuk digunakan oleh aplikasi Express utama
export default router;