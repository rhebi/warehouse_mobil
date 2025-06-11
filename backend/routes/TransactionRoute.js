// // Import library Express dan semua fungsi dari TransactionController
import express from "express";
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
    approveTransaction,
    rejectTransaction,
    getPendingTransactions
} from "../controllers/TransactionController.js";
// // Import middleware untuk verifikasi token dan role
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff, isManagerOrStaff } from "../middleware/VerifyRole.js";

// // Buat instance router
const router = express.Router();

// // PENTING: Urutan route itu ngaruh. Route yang lebih spesifik (seperti '/stats' atau '/pending')
// // harus diletakkan SEBELUM route yang dinamis (seperti '/:id').
// // Kalau tidak, Express akan menganggap 'stats' atau 'pending' sebagai sebuah ID.

// // GET /transactions/stats -> Ambil statistik transaksi (bisa oleh Manager & Staff)
router.get("/stats", verifytoken, isManagerOrStaff, getTransactionStats);

// // GET /transactions/pending -> Lihat transaksi yang menunggu persetujuan (hanya Manager)
router.get("/pending", verifytoken, isManager, getPendingTransactions);

// // GET /transactions -> Lihat semua transaksi (bisa oleh Manager & Staff)
router.get("/", verifytoken, isManagerOrStaff, getTransactions);

// // GET /transactions/1 -> Lihat detail transaksi berdasarkan ID (bisa oleh Manager & Staff)
router.get("/:id", verifytoken, isManagerOrStaff, getTransactionById);

// // POST /transactions -> Membuat transaksi baru (hanya Staff)
router.post("/", verifytoken, isStaff, createTransaction);

// // PATCH /transactions/1 -> Mengubah data transaksi (bisa oleh Manager & Staff)
router.patch("/:id", verifytoken, isManagerOrStaff, updateTransaction);

// // DELETE /transactions/1 -> Menghapus transaksi (hanya Manager)
router.delete("/:id", verifytoken, isManager, deleteTransaction);

// // PATCH /transactions/1/approve -> Menyetujui transaksi (hanya Manager)
router.patch("/:id/approve", verifytoken, isManager, approveTransaction);

// // PATCH /transactions/1/reject -> Menolak transaksi (hanya Manager)
router.patch("/:id/reject", verifytoken, isManager, rejectTransaction);

// // Export router
export default router;