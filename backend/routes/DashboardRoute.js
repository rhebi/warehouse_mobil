import express from "express";
import { getDashboardStats, getTop5Products, getWarehouseUtilization, getLowStockProducts } from "../controllers/DashboardController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff, isManagerOrStaff } from "../middleware/VerifyRole.js"; // Import isManagerOrStaff

const router = express.Router();

// Semua route dashboard dilindungi dan bisa diakses oleh Manager atau Staff
router.get("/", verifytoken, isManagerOrStaff, getDashboardStats);
router.get("/top5-products", verifytoken, isManagerOrStaff, getTop5Products);
router.get("/utilization", verifytoken, isManagerOrStaff, getWarehouseUtilization);
router.get("/low-stock", verifytoken, isManagerOrStaff, getLowStockProducts);

export default router;