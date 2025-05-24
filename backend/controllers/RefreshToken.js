import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(403); 
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
      if (err) return res.sendStatus(403); 
      const user = await Users.findOne({
        where: { id: decode.userId } 
      });
      if (!user) return res.sendStatus(403); 
      const userId = user.id;
      const name = user.name;
      const email = user.email;
      const role = user.role;
      const accessToken = jwt.sign(
        { userId, name, email, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' } 
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};