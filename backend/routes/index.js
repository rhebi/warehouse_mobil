import express from "express";
import { getUser, Register, Login, Logout, getMe } from "../controllers/User.js";
import { verifytoken } from "../middleware/verifyToken.js";
import { isManager, isStaff } from "../middleware/verifyRole.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import DashboardRoute from "./DashboardRoute.js";
import ProductRoute from "./ProductRoute.js";
import TransactionRoute from "./TransactionRoute.js";

const router = express.Router();

router.use("/dashboard", DashboardRoute); 
router.use("/products", ProductRoute);
router.use("/transactions", TransactionRoute);

router.get('/dashboard-manager', verifytoken, isManager, (req, res) => {
  res.json({ msg: "Selamat datang di dashboard manager!" });
});

router.get('/users', verifytoken, getUser);
router.get('/me', verifytoken, getMe);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;
