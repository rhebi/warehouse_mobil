// // Import model User, library bcrypt untuk enkripsi password, dan jwt untuk token
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// // Fungsi untuk mendapatkan SEMUA data user (hanya info dasar)
export const getUser = async (req, res) => {
  try {
    // // Cari semua user, tapi hanya ambil kolom id, name, email, dan role
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// // Fungsi untuk mendapatkan data user yang sedang login (berdasarkan token)
export const getMe = async (req, res) => {
  try {
    // // Cari user berdasarkan ID yang ada di dalam token (req.user.userId)
    const user = await Users.findOne({
      where: {
        id: req.user.userId,
      },
      attributes: ["id", "name", "email", "role"], // // Ambil info dasar saja
    });

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Gagal mengambil data user" });
  }
};

// // Fungsi untuk REGISTRASI user baru
export const Register = async (req, res) => {
  // // Ambil data dari body request
  const { name, email, password, confpassword } = req.body;
  // // Pastikan password dan konfirmasi password sama
  if (password !== confpassword)
    return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

  try {
    // // Cek dulu apakah email sudah pernah terdaftar
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah digunakan" });
    }

    // // Buat 'salt' untuk enkripsi password agar lebih aman
    const salt = await bcrypt.genSalt();
    // // Enkripsi passwordnya menggunakan 'salt' tadi
    const hashPassword = await bcrypt.hash(password, salt);

    // // Logika sederhana untuk menentukan role: jika nama ada di daftar, jadi 'manager'
    const finalRole = ["fajar", "panca", "kevan"].includes(name.toLowerCase()) ? "manager" : "staff";

    // // Buat user baru di database dengan password yang sudah di-enkripsi
    await Users.create({
      name,
      email,
      password: hashPassword,
      role: finalRole,
    });

    // // Kirim respon 201 (Created)
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal registrasi" });
  }
};

// // Fungsi untuk LOGIN user
export const Login = async (req, res) => {
  try {
    // // Cari user berdasarkan email yang dimasukkan
    const user = await Users.findOne({
      where: { email: req.body.email },
    });

    // // Kalau email tidak ditemukan, kasih error
    if (!user)
      return res.status(400).json({ msg: "Email tidak ditemukan" });

    // // Bandingkan password yang dimasukkan dengan password di database (yang sudah di-enkripsi)
    const match = await bcrypt.compare(req.body.password, user.password);
    // // Kalau tidak cocok, kasih error
    if (!match) return res.status(400).json({ msg: "Password salah" });

    // // Jika berhasil login, siapkan data user untuk dimasukkan ke dalam token
    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role;

    // // Buat ACCESS TOKEN: ini token utama yang dipakai untuk mengakses halaman-halaman
    // // Masa berlakunya pendek (misal: 40 menit)
    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "40m" }
    );
    
    // // Buat REFRESH TOKEN: ini token "cadangan" untuk mendapatkan accessToken baru jika sudah expired
    // // Masa berlakunya lebih lama (misal: 1 hari)
    const refreshToken = jwt.sign(
      { userId, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // // Simpan refresh token ke database user
    await Users.update({ refresh_token: refreshToken }, { where: { id: userId } });

    // // Kirim refresh token ke browser dalam bentuk httpOnly cookie (lebih aman)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // // Masa berlaku cookie 1 hari
    });

    // // Kirim access token ke frontend
    return res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ msg: "Server error saat login" });
  }
};

// // Fungsi untuk LOGOUT user
export const Logout = async (req, res) => {
  // // Ambil refresh token dari cookie di browser
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204); // // Kalau tidak ada token, anggap sudah logout

  // // Cari user di database yang punya refresh token ini
  const user = await Users.findOne({
    where: { refresh_token: refreshToken },
  });

  if (!user) return res.sendStatus(204); // // Kalau user tidak ditemukan, anggap sudah logout

  // // Hapus refresh token dari database (set jadi null)
  await Users.update({ refresh_token: null }, {
    where: { id: user.id }
  });

  // // Hapus cookie refreshToken dari browser
  res.clearCookie("refreshToken");
  return res.sendStatus(200); // // Kirim status 200 (OK)
};