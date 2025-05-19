export const isManager = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== "manager") {
    return res.status(403).json({ msg: "Akses hanya untuk manager" });
  }
  next();
};

export const isStaffOrManager = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole === "manager" || userRole === "staff") {
    next();
  } else {
    return res.status(403).json({ msg: "Akses ditolak" });
  }
};
