import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProductFull,
    updateProductLimited,
    deleteProduct,
    approveProduct,
    rejectProduct, // Tambahkan ini
    getPendingProducts // Tambahkan ini
} from "../controllers/ProductController.js";

import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff, isManagerOrStaff } from "../middleware/VerifyRole.js";

const router = express.Router();

// Semua route di bawah ini akan memerlukan verifikasi token
router.use("/", verifytoken); // Middleware verifytoken diterapkan ke semua route di router ini

// Route yang bisa diakses Manager atau Staff
router.get("/", isManagerOrStaff, getProducts); // Mengambil semua produk
router.get("/:id", isManagerOrStaff, getProductById); // Mengambil produk berdasarkan ID

// Route Manager-only
router.post("/", isManager, createProduct); // Tambah produk
router.patch("/:id", isManager, updateProductFull); // Update full produk
router.delete("/:id", isManager, deleteProduct); // Hapus produk
router.patch("/:id/approve", isManager, approveProduct); // Set status produk menjadi 'approved'
router.patch("/:id/reject", isManager, rejectProduct); // Set status produk menjadi 'rejected'
router.get("/pending", isManager, getPendingProducts); // Mendapatkan produk yang statusnya 'pending'

// Route Staff-only (update stock, location, status)
router.patch("/:id/limited", isStaff, updateProductLimited);

export default router;