import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401); // 401 Unauthorized, bukan 403 Forbidden
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
            if (err) {
                console.error("Refresh token verification failed:", err.message);
                return res.sendStatus(403); // 403 Forbidden jika token tidak valid/expired
            }
            const user = await Users.findOne({
                where: { id: decode.userId }
            });
            if (!user || user.refresh_token !== refreshToken) { // Verifikasi refresh_token di DB
                console.warn("User or refresh token mismatch for userId:", decode.userId);
                return res.sendStatus(403);
            }
            const userId = user.id;
            const name = user.name;
            const email = user.email;
            const role = user.role;
            const accessToken = jwt.sign(
                { userId, name, email, role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } // Biasanya accessToken lebih pendek (misal 15m)
            );
            res.json({ accessToken });
        });
    } catch (error) {
        console.error("Refresh Token Controller Error:", error);
        res.status(500).json({ msg: "Server error during refresh token" });
    }
};
