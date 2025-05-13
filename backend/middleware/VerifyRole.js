export const verifyRole = (req, res, next) => {
  console.log("Role yang masuk:", req.user);
    const userRole = req.user.role; 
    if (userRole !== 'manager') {
      return res.status(403).json({ msg: "Akses hanya untuk manager" });
    }
    next();
  };