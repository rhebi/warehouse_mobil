import express from "express";
import { getUser, Register, Login, Logout } from "../controllers/User.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { verifyRole } from "../middleware/VerifyRole.js";
import { refreshToken } from "../controllers/RefreshToken.js";


const router = express.Router();

router.get('/dashboard-manager', verifytoken, verifyRole, (req, res) => {
    res.json({ msg: "Selamat datang di dashboard manager!" });
  });
router.get('/users', verifytoken, getUser);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;