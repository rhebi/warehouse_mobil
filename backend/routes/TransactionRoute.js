// backend/routes/TransactionRoute.js
import express from "express";
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
    approveTransaction,
    rejectTransaction
} from "../controllers/TransactionController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff, isManagerOrStaff } from "../middleware/VerifyRole.js";

const router = express.Router();

router.get("/stats", verifytoken, isManagerOrStaff, getTransactionStats);

router.get("/", verifytoken, isManagerOrStaff, getTransactions); // Mengambil semua transaksi
router.get("/:id", verifytoken, isManagerOrStaff, getTransactionById); // Mengambil transaksi berdasarkan ID

router.post("/", verifytoken, isManagerOrStaff, createTransaction);
router.patch("/:id", verifytoken, isManagerOrStaff, updateTransaction);
router.delete("/:id", verifytoken, isManagerOrStaff, deleteTransaction);

// Route approval transaksi (Manager only)
router.patch("/:id/approve", verifytoken, isManager, approveTransaction);
router.patch("/:id/reject", verifytoken, isManager, rejectTransaction);


export default router;