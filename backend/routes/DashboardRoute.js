import express from "express";
import { getDashboardStats } from "../controllers/DashboardController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff } from "../middleware/VerifyRole.js";

const router = express.Router();

router.get("/", verifytoken, isManager, getDashboardStats); // /dashboard

export default router;
