// // Import Express, controller, dan middleware
import express from "express";
import {
    createInventoryMovement,
    getInventoryMovements,
    getMonthlyInventoryMovements
} from "../controllers/InventoryMovementController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff, isManagerOrStaff } from "../middleware/VerifyRole.js";

// // Buat instance router
const router = express.Router();

// // Semua request ke URL pergerakan inventaris harus punya token yang valid (harus login)
router.use("/", verifytoken);

// // POST /inventory-movements -> Mencatat pergerakan stok baru (hanya Manager)
// // Contoh: saat menerima barang dari supplier
router.post("/", isManager, createInventoryMovement); 

// // GET /inventory-movements -> Melihat semua riwayat pergerakan stok (bisa Manager & Staff)
router.get("/", isManagerOrStaff, getInventoryMovements);

// // GET /inventory-movements/monthly-stats -> Mendapatkan statistik bulanan untuk grafik (bisa Manager & Staff)
router.get("/monthly-stats", isManagerOrStaff, getMonthlyInventoryMovements);

// // Export router
export default router;