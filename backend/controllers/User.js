import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confpassword, role } = req.body;
  if (password !== confpassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const validRoles = ["staff", "manager"];
    const finalRole = validRoles.includes(role) ? role : "staff";

    await Users.create({
      name,
      email,
      password: hashPassword,
      role: finalRole,
    });
    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal registrasi" });
  }
};

export const Login = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: { email: req.body.email },
    });
    if (users.length === 0)
      return res.status(400).json({ msg: "Email tidak ditemukan" });

    const user = users[0];
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const userId = user.id;      // ← default field primary key
    const name = user.name;
    const email = user.email;
    const role = user.role;

    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "45s" } //ganti jadi 1h kalo semisal pas CRUD error//
    );
    const refreshToken = jwt.sign(
      { userId, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });  // ← kirim token ke client
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where:{
      refresh_token: refreshToken
    }
  });
  if(!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update({refresh_token: null}, {
      where: {
        id: userId
      }
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
}
