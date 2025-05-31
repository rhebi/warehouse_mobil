import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Transaction from "../models/TransactionModel.js";
import { fn, col, Op, literal } from "sequelize"; // Import Op dan literal untuk query lanjutan

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalProducts = await Product.count();
        const totalTransactions = await Transaction.count();

        const monthly = await Transaction.findAll({
            attributes: [
                [fn("MONTH", col("createdAt")), "month"],
                [fn("YEAR", col("createdAt")), "year"], // Tambahkan tahun untuk data bulanan yang lebih akurat
                [fn("COUNT", col("id")), "total"],
            ],
            group: [fn("YEAR", col("createdAt")), fn("MONTH", col("createdAt"))],
            order: [[fn("YEAR", col("createdAt")), "ASC"], [fn("MONTH", col("createdAt")), "ASC"]],
            raw: true,
        });

        // Map data bulanan untuk 12 bulan terakhir, isi 0 jika tidak ada transaksi
        const monthlyTransactions = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1; // getMonth() is 0-indexed
            const year = date.getFullYear();
            const monthName = date.toLocaleString('id-ID', { month: 'short' });

            const found = monthly.find(item => parseInt(item.month) === month && parseInt(item.year) === year);
            monthlyTransactions.unshift({ // Add to the beginning to keep chronological order
                month: monthName,
                total: found ? parseInt(found.total) : 0,
            });
        }


        res.json({
            totalUsers,
            totalProducts,
            totalTransactions,
            monthlyTransactions,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Gagal ambil data dashboard" });
    }
};

export const getTop5Products = async (req, res) => {
    try {
        const topProducts = await Transaction.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('quantity')), 'totalSold']
            ],
            group: ['product_id'],
            order: [[literal('totalSold'), 'DESC']],
            limit: 5,
            include: [{
                model: Product,
                attributes: ['name']
            }],
            raw: true,
        });

        // Format hasil agar sesuai dengan ekspektasi frontend (name, sold)
        const formattedTopProducts = topProducts.map(item => ({
            name: item['product.name'],
            sold: parseInt(item.totalSold),
        }));

        res.json(formattedTopProducts);
    } catch (err) {
        console.error("Error fetching top 5 products:", err);
        res.status(500).json({ msg: "Gagal mengambil data top 5 produk" });
    }
};

export const getWarehouseUtilization = async (req, res) => {
    try {
        const totalCurrentStock = await Product.sum('stock');
        const assumedMaxCapacity = 1000; // Contoh: kapasitas total gudang 1000 unit mobil

        let utilization = 0;
        if (assumedMaxCapacity > 0) {
            utilization = (totalCurrentStock / assumedMaxCapacity) * 100;
        }

        res.json({
            currentStock: totalCurrentStock,
            maxCapacity: assumedMaxCapacity,
            utilization: parseFloat(utilization.toFixed(2)) // Format ke 2 desimal
        });

    } catch (err) {
        console.error("Error fetching warehouse utilization:", err);
        res.status(500).json({ msg: "Gagal mengambil data utilitas gudang" });
    }
};

export const getLowStockProducts = async (req, res) => {
    try {
        const lowStockThreshold = 5; // Batas stok rendah, bisa dibuat dari .env atau konfigurasi

        const lowStockProducts = await Product.findAll({
            where: {
                stock: {
                    [Op.lte]: lowStockThreshold // Stok kurang dari atau sama dengan ambang batas
                }
            },
            attributes: ['name', 'stock'],
            order: [['stock', 'ASC']]
        });

        res.json(lowStockProducts);
    } catch (err) {
        console.error("Error fetching low stock products:", err);
        res.status(500).json({ msg: "Gagal mengambil data stok rendah" });
    }
};