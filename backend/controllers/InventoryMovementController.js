// // Import semua model yang dibutuhkan
import InventoryMovement from "../models/InventoryMovementModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Sequelize } from "sequelize";

// // Fungsi untuk MEMBUAT catatan pergerakan inventaris baru
export const createInventoryMovement = async (req, res) => {
    try {
        // // Ambil data dari body request
        const { product_id, quantity, type, reason, location_from, location_to, notes } = req.body;
        const user_id = req.user.userId; // // Ambil ID user yang login dari token

        // // Cek dulu apakah produknya ada di database
        const product = await Product.findByPk(product_id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // // Siapkan variabel untuk stok baru, awalnya diisi dengan stok sekarang
        let newStock = product.stock;

        // // Logika untuk mengupdate stok berdasarkan tipe pergerakannya
        if (type === 'inbound') {
            // // Kalau barang masuk, stok ditambah
            newStock += quantity;
        } else if (type === 'outbound' || type === 'transfer') {
            // // Kalau barang keluar atau transfer, cek dulu stoknya cukup atau ngga
            if (newStock < quantity) {
                return res.status(400).json({ message: "Stok tidak mencukupi untuk pergerakan keluar ini." });
            }
            // // Kalau cukup, stok dikurangi
            newStock -= quantity;
        } else if (type === 'adjustment') {
            // // Kalau penyesuaian, 'quantity' bisa positif (nambah) atau negatif (ngurang)
            newStock += quantity;
            if (newStock < 0) { // // Pastikan stok tidak jadi minus
                return res.status(400).json({ message: "Adjustment akan membuat stok negatif. Pastikan jumlahnya benar." });
            }
        } else {
            // // Kalau tipe pergerakannya aneh, kasih error
            return res.status(400).json({ message: "Tipe pergerakan tidak valid." });
        }

        // // Setelah logika stok selesai, buat catatan pergerakannya di tabel InventoryMovement
        const newMovement = await InventoryMovement.create({
            product_id, quantity, type, reason, user_id, location_from, location_to, notes
        });

        // // Terakhir, update jumlah stok di tabel Product
        await Product.update({ stock: newStock }, { where: { id: product_id } });

        // // Kirim respon sukses beserta data pergerakan dan stok terbaru
        res.status(201).json({ 
            message: "Inventory movement recorded and stock updated.",
            movement: newMovement,
            newProductStock: newStock
        });

    } catch (err) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ message: err.message });
    }
};

// // Fungsi untuk mengambil SEMUA data pergerakan inventaris (buat laporan)
export const getInventoryMovements = async (req, res) => {
    try {
        // // Cari semua data, sertakan juga detail produk dan user yang mencatat
        const movements = await InventoryMovement.findAll({
            include: [
                { model: Product, attributes: ['name', 'model', 'location', 'gudang'] },
                { model: User, attributes: ['name', 'email'] }
            ],
            order: [["createdAt", "DESC"]] // // Urutkan dari yang paling baru
        });
        // // Kirim hasilnya
        res.json(movements);
    } catch (err) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ message: err.message });
    }
};

// // Fungsi untuk mengambil statistik pergerakan inventaris per bulan (buat dashboard/grafik)
export const getMonthlyInventoryMovements = async (req, res) => {
    try {
        // // Query ini agak kompleks, gunanya untuk mengelompokkan data per bulan dan tahun
        const monthlyMovements = await InventoryMovement.findAll({
            attributes: [
                // // Ambil angka bulannya (e.g., 1 untuk Januari)
                [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
                // // Ambil tahunnya
                [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
                // // Jumlahkan 'quantity' HANYA jika tipenya 'inbound', beri nama 'totalInbound'
                [Sequelize.fn("SUM", Sequelize.literal("CASE WHEN type = 'inbound' THEN quantity ELSE 0 END")), "totalInbound"],
                // // Jumlahkan 'quantity' HANYA jika tipenya 'outbound' atau 'transfer', beri nama 'totalOutbound'
                [Sequelize.fn("SUM", Sequelize.literal("CASE WHEN type IN ('outbound', 'transfer') THEN quantity ELSE 0 END")), "totalOutbound"],
            ],
            // // Kelompokkan hasilnya berdasarkan tahun dan bulan
            group: [Sequelize.fn("YEAR", Sequelize.col("createdAt")), Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
            order: [[Sequelize.fn("YEAR", Sequelize.col("createdAt")), "ASC"], [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"]],
            raw: true // // Hasilnya berupa data mentah, bukan model Sequelize
        });

        // // Bagian ini untuk memformat data agar siap ditampilkan di grafik
        const now = new Date();
        const formattedMonthlyMovements = [];
        // // Looping untuk 12 bulan ke belakang dari sekarang
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const monthName = date.toLocaleString('id-ID', { month: 'short' }); // // Nama bulan (e.g., Jan, Feb)

            // // Cari apakah ada data dari query tadi untuk bulan dan tahun ini
            const found = monthlyMovements.find(item => parseInt(item.month) === month && parseInt(item.year) === year);
            // // Masukkan ke array hasil, kalau ngga ada data, isinya 0
            formattedMonthlyMovements.unshift({ // // 'unshift' biar urut dari paling lama ke paling baru
                month: monthName,
                year: year,
                totalInbound: found ? parseInt(found.totalInbound) : 0,
                totalOutbound: found ? parseInt(found.totalOutbound) : 0,
            });
        }

        // // Kirim hasil data yang sudah terformat rapi
        res.json(formattedMonthlyMovements);
    } catch (err) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ message: err.message });
    }
};