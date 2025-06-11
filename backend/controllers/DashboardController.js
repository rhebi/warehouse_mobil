// // Import semua model dan fungsi Sequelize yang dibutuhkan
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Transaction from "../models/TransactionModel.js";
import InventoryMovement from "../models/InventoryMovementModel.js";
import { fn, col, Op, literal, Sequelize } from "sequelize";

// // Fungsi untuk mengambil data statistik utama untuk dashboard
export const getDashboardStats = async (req, res) => {
    try {
        // // Hitung jumlah total user
        const totalUsers = await User.count();
        // // Hitung jumlah total produk
        const totalProducts = await Product.count();
        // // Hitung jumlah total transaksi yang statusnya 'approved'
        const totalTransactions = await Transaction.count({
            where: { status: 'approved' }
        });

        // // Hitung total volume pergerakan stok (barang masuk + keluar + adjustment)
        const totalMovementVolumeResult = await InventoryMovement.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalMovementVolume']
            ]
        });
        const totalMovementVolume = totalMovementVolumeResult.dataValues.totalMovementVolume || 0;

        // // Ambil data transaksi per bulan untuk grafik (hanya yang sudah 'approved')
        const monthly = await Transaction.findAll({
            attributes: [
                [fn("MONTH", col("createdAt")), "month"], // // Ambil bulannya
                [fn("YEAR", col("createdAt")), "year"],   // // Ambil tahunnya
                [fn("COUNT", col("id")), "total"],       // // Hitung jumlah transaksinya
            ],
            where: {
                status: 'approved' 
            },
            group: [fn("YEAR", col("createdAt")), fn("MONTH", col("createdAt"))],
            order: [[fn("YEAR", col("createdAt")), "ASC"], [fn("MONTH", col("createdAt")), "ASC"]],
            raw: true,
        });

        // // Format data bulanan agar rapi dan siap pakai di frontend (sama seperti di file lain)
        const monthlyTransactions = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const monthName = date.toLocaleString('id-ID', { month: 'short' });

            const found = monthly.find(item => parseInt(item.month) === month && parseInt(item.year) === year);
            monthlyTransactions.unshift({
                month: monthName,
                total: found ? parseInt(found.total) : 0,
            });
        }

        // // Kirim semua data statistik dalam satu response JSON
        res.json({
            totalUsers,
            totalProducts,
            totalTransactions,
            monthlyTransactions,
            totalMovementVolume,
        });

    } catch (err) {
        res.status(500).json({ msg: "Gagal ambil data dashboard" });
    }
};

// // Fungsi untuk mendapatkan 5 produk terlaris
export const getTop5Products = async (req, res) => {
    try {
        // // Query untuk menjumlahkan kuantitas (`quantity`) per produk dari semua transaksi
        const topProducts = await Transaction.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('quantity')), 'totalSold'] // // Jumlahkan kuantitas dan beri nama 'totalSold'
            ],
            group: ['product_id'], // // Kelompokkan berdasarkan ID produk
            order: [[literal('totalSold'), 'DESC']], // // Urutkan dari total penjualan terbanyak
            limit: 5, // // Ambil 5 teratas
            include: [{ // // Sertakan nama produknya
                model: Product,
                attributes: ['name']
            }],
            raw: true,
        });

        // // Format ulang hasilnya agar lebih mudah dibaca di frontend
        const formattedTopProducts = topProducts.map(item => ({
            name: item['product.name'],
            sold: parseInt(item.totalSold),
        }));

        res.json(formattedTopProducts);
    } catch (err) {
        res.status(500).json({ msg: "Gagal mengambil data top 5 produk" });
    }
};

// // Fungsi untuk menghitung utilisasi atau penggunaan kapasitas gudang
export const getWarehouseUtilization = async (req, res) => {
    try {
        // // Jumlahkan semua stok produk yang ada saat ini
        const totalCurrentStock = await Product.sum('stock');
        // // Asumsi kapasitas maksimal gudang (ini bisa dibuat dinamis nanti)
        const assumedMaxCapacity = 1000;

        // // Hitung persentase utilisasi
        let utilization = 0;
        if (assumedMaxCapacity > 0) {
            utilization = (totalCurrentStock / assumedMaxCapacity) * 100;
        }

        // // Kirim hasilnya
        res.json({
            currentStock: totalCurrentStock,
            maxCapacity: assumedMaxCapacity,
            utilization: parseFloat(utilization.toFixed(2)) // // Bulatkan 2 angka di belakang koma
        });

    } catch (err) {
        res.status(500).json({ msg: "Gagal mengambil data utilitas gudang" });
    }
};

// // Fungsi untuk mendapatkan produk yang stoknya menipis
export const getLowStockProducts = async (req, res) => {
    try {
        // // Tentukan batas stok rendah (misal, 5)
        const lowStockThreshold = 5;

        // // Cari semua produk yang stoknya kurang dari atau sama dengan batas tersebut
        const lowStockProducts = await Product.findAll({
            where: {
                stock: {
                    [Op.lte]: lowStockThreshold // // lte = Less Than or Equal to
                }
            },
            attributes: ['name', 'stock'], // // Hanya ambil nama dan sisa stoknya
            order: [['stock', 'ASC']] // // Urutkan dari yang paling sedikit
        });

        res.json(lowStockProducts);
    } catch (err) {
        res.status(500).json({ msg: "Gagal mengambil data stok rendah" });
    }
};