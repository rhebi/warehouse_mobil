import express from "express";
import { getUser, Register, Login, Logout, getMe } from "../controllers/User.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager } from "../middleware/VerifyRole.js"; // Hapus isStaff jika tidak diperlukan di sini
import { refreshToken } from "../controllers/RefreshToken.js";
import DashboardRoute from "./DashboardRoute.js";
import ProductRoute from "./ProductRoute.js";
import TransactionRoute from "./TransactionRoute.js";

const router = express.Router();

// Gunakan sub-router untuk modularitas
router.use("/dashboard", DashboardRoute);
router.use("/products", ProductRoute);
router.use("/transactions", TransactionRoute);

// Route-route user dan autentikasi
router.get('/users', verifytoken, isManager, getUser); // Hanya manager yang bisa melihat daftar user
router.get('/me', verifytoken, getMe);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// Contoh route manager only (jika masih diperlukan)
router.get('/dashboard-manager', verifytoken, isManager, (req, res) => {
    res.json({ msg: "Selamat datang di dashboard manager!" });
});

export default router;