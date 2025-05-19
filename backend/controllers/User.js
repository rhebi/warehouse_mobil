import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mendapatkan semua user (hanya id, name, email, role)
export const getUser = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Mendapatkan user berdasarkan token
export const getMe = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.user.userId,
      },
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    res.json(user);
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ msg: "Gagal mengambil data user" });
  }
};

// Register user baru
export const Register = async (req, res) => {
  const { name, email, password, confpassword } = req.body;
  if (password !== confpassword)
    return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

  try {
    // Cek apakah email sudah digunakan
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah digunakan" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Tentukan role berdasarkan nama
    const finalRole = name.toLowerCase() === "fajar" ? "manager" : "staff";

    await Users.create({
      name,
      email,
      password: hashPassword,
      role: finalRole,
    });

    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ msg: "Gagal registrasi" });
  }
};

// Login user
export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email: req.body.email },
    });

    if (!user)
      return res.status(400).json({ msg: "Email tidak ditemukan" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role;

    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    console.log("Generated Access Token Payload:", jwt.decode(accessToken));

    const refreshToken = jwt.sign(
      { userId, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Users.update({ refresh_token: refreshToken }, { where: { id: userId } });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ msg: "Server error saat login" });
  }
};

// Logout user
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await Users.findOne({
    where: { refresh_token: refreshToken },
  });

  if (!user) return res.sendStatus(204);

  await Users.update({ refresh_token: null }, {
    where: { id: user.id }
  });

  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
