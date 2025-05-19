import express from "express";
import { getUser, Register, Login, Logout, getMe } from "../controllers/User.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaffOrManager } from "../middleware/VerifyRole.js";
import { refreshToken } from "../controllers/RefreshToken.js";


const router = express.Router();

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