// middleware/VerifyRole.js

export const isManager = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== "manager") {
    return res.status(403).json({ msg: "Akses hanya untuk manager" });
  }
  next();
};

export const isStaff = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== "staff") {
    return res.status(403).json({ msg: "Akses hanya untuk staff" });
  }
  next();
};
