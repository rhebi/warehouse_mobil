// // Import library Express untuk membuat router
import express from "express";
// // Import semua fungsi dari ProductController
import {
    getProducts,
    getProductById,
    createProduct,
    updateProductFull,
    updateProductLimited,
    deleteProduct,
    approveProduct,
    rejectProduct,
    getPendingProducts
} from "../controllers/ProductController.js";
// // Import middleware untuk verifikasi token dan role
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff, isManagerOrStaff } from "../middleware/VerifyRole.js";

// // Buat instance router dari Express
const router = express.Router();

// // PENTING: Baris ini menerapkan middleware 'verifytoken' ke SEMUA route di bawahnya.
// // Artinya, semua request ke URL produk harus punya token yang valid (harus login).
router.use("/", verifytoken);

// // == Route yang bisa diakses oleh Manager dan Staff ==
// // GET /products -> Menjalankan fungsi getProducts
router.get("/", isManagerOrStaff, getProducts);
// // GET /products/1 -> Menjalankan fungsi getProductById dengan id=1
router.get("/:id", isManagerOrStaff, getProductById);
// // GET /products/pending -> Menjalankan fungsi getPendingProducts (diletakkan di bawah karena spesifik manager)
router.get("/pending", isManager, getPendingProducts);

// // == Route yang HANYA bisa diakses oleh Manager ==
// // POST /products -> Menjalankan fungsi createProduct
router.post("/", isManager, createProduct);
// // PATCH /products/1 -> Menjalankan fungsi updateProductFull (update data lengkap)
router.patch("/:id", isManager, updateProductFull);
// // DELETE /products/1 -> Menjalankan fungsi deleteProduct
router.delete("/:id", isManager, deleteProduct);
// // PATCH /products/1/approve -> Menjalankan fungsi approveProduct
router.patch("/:id/approve", isManager, approveProduct);
// // PATCH /products/1/reject -> Menjalankan fungsi rejectProduct
router.patch("/:id/reject", isManager, rejectProduct);

// // == Route yang HANYA bisa diakses oleh Staff ==
// // PATCH /products/1/limited -> Menjalankan fungsi updateProductLimited (update data terbatas)
router.patch("/:id/limited", isStaff, updateProductLimited);

// // Export router ini agar bisa dipakai di file utama (index.js)
export default router;