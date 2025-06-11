// // Import Express, controller, dan middleware
import express from "express";
import { getDashboardStats, getTop5Products, getWarehouseUtilization, getLowStockProducts } from "../controllers/DashboardController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManagerOrStaff } from "../middleware/VerifyRole.js";

// // Buat instance router
const router = express.Router();

// // Semua URL di bawah ini perlu login dan bisa diakses oleh Manager atau Staff

// // GET /dashboard/ -> Mengambil statistik utama (total user, produk, transaksi)
router.get("/", verifytoken, isManagerOrStaff, getDashboardStats);
// // GET /dashboard/top5-products -> Mengambil data 5 produk terlaris
router.get("/top5-products", verifytoken, isManagerOrStaff, getTop5Products);
// // GET /dashboard/utilization -> Mengambil data utilisasi gudang
router.get("/utilization", verifytoken, isManagerOrStaff, getWarehouseUtilization);
// // GET /dashboard/low-stock -> Mengambil data produk yang stoknya menipis
router.get("/low-stock", verifytoken, isManagerOrStaff, getLowStockProducts);

// // Export router
export default router;