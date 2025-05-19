import jwt from "jsonwebtoken";

export const verifytoken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Token tidak ditemukan" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Token tidak valid atau expired" });
    }
    console.log("Decoded JWT:", decoded);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,  
    };
    next();
  });
};
