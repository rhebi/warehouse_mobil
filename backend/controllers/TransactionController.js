// Import semua model yang dibutuhkan dan Sequelize Operator
import Transaction from "../models/TransactionModel.js"; // Import model Transaction (untuk tabel transaksi)
import Product from "../models/ProductModel.js";     // Import model Product (untuk tabel produk)
import User from "../models/UserModel.js";           // Import model User (untuk tabel user)
import { Sequelize, fn, col, Op } from "sequelize";    // Import Sequelize, fn (fungsi), col (kolom), dan Op (operator) untuk query kompleks

// Fungsi untuk mengambil SEMUA data transaksi
export const getTransactions = async (req, res) => {
    try {
        // Cari semua transaksi di database
        const transactions = await Transaction.findAll({
            // Sertakan (JOIN) data dari tabel Product dan User yang terkait
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] }, // Ambil nama, lokasi, gudang dari produk
                { model: User, attributes: ['name', 'email'] }                   // Ambil nama dan email dari user
            ],
            order: [["createdAt", "DESC"]], // Urutkan hasil dari tanggal pembuatan terbaru (DESCending)
        });
        res.json(transactions); // Kirim data transaksi sebagai respons JSON
    } catch (err) {
        // Jika terjadi error, kirim status 500 (Internal Server Error) dengan pesan error
        res.status(500).json({ message: err.message });
    }
};

// Fungsi untuk mengambil SATU transaksi berdasarkan ID-nya
export const getTransactionById = async (req, res) => {
    try {
        // Cari transaksi berdasarkan Primary Key (id) yang diambil dari parameter URL (req.params.id)
        const transaction = await Transaction.findByPk(req.params.id, {
            // Sertakan (JOIN) data Product dan User yang terkait
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] },
                { model: User, attributes: ['name', 'email'] }
            ],
        });
        // Jika transaksi tidak ditemukan, kirim respons 404 (Not Found)
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        res.json(transaction); // Kirim data transaksi yang ditemukan sebagai respons JSON
    } catch (err) {
        // Jika terjadi error, kirim status 500 (Internal Server Error)
        res.status(500).json({ message: err.message });
    }
};

// Fungsi untuk MEMBUAT transaksi baru
// CATATAN: PENGURANGAN STOK DIHAPUS DARI SINI, AKAN DILAKUKAN SAAT APPROVE
export const createTransaction = async (req, res) => {
    try {
        // Ambil data transaksi dari body request (data yang dikirim dari frontend)
        const { transaction_code, buyer_name, product_id, quantity, location, status, gudang } = req.body;
        const user_id = req.user.userId; // Ambil ID user yang sedang login dari `req.user` (disediakan oleh middleware `verifytoken`)

        // Cek dulu produknya ada atau tidak di database
        const product = await Product.findByPk(product_id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        
        // Validasi stok tetap dilakukan di sini agar tidak ada request transaksi yang tidak mungkin disetujui
        if (product.stock < quantity) return res.status(400).json({ message: "Stok produk tidak mencukupi untuk transaksi ini." });

        // Hitung total harga = harga produk * kuantitas transaksi
        const total_price = product.price * quantity;
        
        // Buat record transaksi baru di database
        const newTransaction = await Transaction.create({
            transaction_code, // Kode transaksi
            buyer_name,       // Nama pembeli
            product_id,       // ID produk yang dibeli
            quantity,         // Kuantitas produk
            total_price,      // Total harga
            user_id,          // ID user yang membuat transaksi
            location: location || product.location, // Gunakan lokasi dari request, jika tidak ada pakai lokasi produk
            status: status || 'pending', // Default status 'pending' jika tidak dikirim dari request
            gudang: gudang || product.gudang,       // Gunakan gudang dari request, jika tidak ada pakai gudang produk
        });

        // Hapus komentar ini: Pengurangan stok produk setelah transaksi dibuat (akan dilakukan di approveTransaction)
        // Logika pengurangan stok dipindahkan ke `approveTransaction` untuk alur persetujuan.
        // await Product.update(
        //      { stock: product.stock - quantity },
        //      { where: { id: product_id } }
        // );

        // Ambil lagi data transaksi yang baru dibuat beserta relasinya untuk dikirim sebagai respons
        const createdTransaction = await Transaction.findByPk(newTransaction.id, {
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] },
                { model: User, attributes: ['name', 'email'] }
            ],
        });

        // Kirim respons 201 (Created) dan data transaksi yang baru dibuat
        res.status(201).json(createdTransaction);
    } catch (err) {
        // Log error di konsol server untuk debugging
        console.error("Error creating transaction:", err);
        // Jika terjadi error, kirim status 500 (Internal Server Error)
        res.status(500).json({ message: err.message });
    }
};

// Update transaction (hitung ulang total_price, tambahkan status transaksi)
export const updateTransaction = async (req, res) => {
    try {
        // Cari transaksi yang mau diupdate berdasarkan ID dari parameter URL
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        // Ambil data baru dari body request
        const { buyer_name, product_id, quantity, location, status, gudang } = req.body;

        // Ambil ID produk dan kuantitas lama dari transaksi yang ada untuk perbandingan
        const oldProductId = transaction.product_id;
        const oldQuantity = transaction.quantity;

        // Tentukan product_id dan quantity yang akan digunakan untuk update
        const pid = product_id || oldProductId; // Gunakan product_id baru jika ada, kalau tidak pakai yang lama
        const qty = quantity || oldQuantity;   // Gunakan quantity baru jika ada, kalau tidak pakai yang lama

        // Cari info produk (bisa produk yang sama atau produk baru jika product_id berubah)
        const product = await Product.findByPk(pid);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Catatan penting tentang skenario update transaksi:
        // Jika transaksi sudah diapprove/completed dan ada perubahan kuantitas/produk, ini perlu diatur lebih lanjut.
        // Contoh: jika transaksi sudah approved dan quantity diubah, stok di gudang harus disesuaikan kembali.
        // Untuk saat ini, kita asumsikan update ini hanya dilakukan pada transaksi 'pending' atau 'rejected'
        // yang belum memengaruhi stok secara final. Jika statusnya 'approved' atau 'completed' dan diupdate,
        // itu adalah skenario yang lebih kompleks yang memerlukan penyesuaian stok yang teliti.

        // Hitung ulang total harga berdasarkan produk dan kuantitas terbaru
        const total_price = product.price * qty;

        // Update data transaksi di database
        await transaction.update({
            buyer_name: buyer_name || transaction.buyer_name, // Gunakan buyer_name baru atau yang lama
            product_id: pid,                               // Gunakan product_id baru atau yang lama
            quantity: qty,                                 // Gunakan quantity baru atau yang lama
            total_price,                                   // Total harga yang sudah dihitung ulang
            location: location || transaction.location,    // Gunakan lokasi baru atau yang lama
            status: status || transaction.status,          // Gunakan status baru atau yang lama
            gudang: gudang || transaction.gudang,          // Gunakan gudang baru atau yang lama
        });

        // Hapus atau sesuaikan logika update stok di sini jika update transaksi memengaruhi stok yang sudah berkurang/bertambah.
        // Untuk alur approve, update transaksi (kecuali status) biasanya hanya boleh dilakukan jika statusnya 'pending'.
        // Misal: Jika diupdate dari pending ke approved, maka stok baru dikurangi di fungsi `approveTransaction`.

        // Ambil data transaksi yang sudah diupdate beserta relasinya untuk dikirim sebagai respons
        const updatedTransaction = await Transaction.findByPk(req.params.id, {
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] },
                { model: User, attributes: ['name', 'email'] }
            ],
        });

        res.json(updatedTransaction); // Kirim data transaksi yang sudah diupdate
    } catch (err) {
        // Log error di konsol server untuk debugging
        console.error("Error updating transaction:", err);
        // Jika terjadi error, kirim status 500 (Internal Server Error)
        res.status(500).json({ message: err.message });
    }
};

// Delete transaction (kembalikan stok produk HANYA jika statusnya APPROVED/COMPLETED)
export const deleteTransaction = async (req, res) => {
    try {
        // Cari transaksi yang mau dihapus berdasarkan ID
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        // Logika PENTING: Hanya kembalikan stok jika status transaksi sebelumnya adalah 'approved' atau 'completed'.
        // Ini karena stok baru dikurangi saat transaksi di-approve. Jika statusnya 'pending' atau 'rejected',
        // stok belum pernah dikurangi, jadi tidak perlu dikembalikan.
        if (transaction.status === 'approved' || transaction.status === 'completed') {
            await Product.update(
                // Tambahkan kembali kuantitas transaksi ke stok produk menggunakan Sequelize.literal
                { stock: Sequelize.literal(`stock + ${transaction.quantity}`) },
                { where: { id: transaction.product_id } } // Hanya update produk yang terkait
            );
        }

        // Hapus record transaksi dari database
        await transaction.destroy();
        res.json({ message: "Deleted successfully" }); // Kirim pesan sukses
    } catch (err) {
        // Log error di konsol server untuk debugging
        console.error("Error deleting transaction:", err);
        // Jika terjadi error, kirim status 500 (Internal Server Error)
        res.status(500).json({ message: err.message });
    }
};

// Fungsi untuk mengambil STATISTIK transaksi (digunakan di dashboard)
export const getTransactionStats = async (req, res) => {
    try {
        // Menghitung total jumlah transaksi (semua status)
        const totalTransactions = await Transaction.count();

        // Menghitung total pemasukan (SUM dari total_price) dari transaksi yang sudah 'approved'
        const totalRevenueResult = await Transaction.findOne({
            attributes: [[Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenue']],
            where: {
                status: 'approved' // Hanya hitung revenue dari transaksi yang disetujui
            }
        });
        // Ambil nilai totalRevenue, jika tidak ada (null), set ke 0
        const totalRevenue = totalRevenueResult.dataValues.totalRevenue || 0;

        // Mengambil statistik transaksi per produk
        const transactionsPerProduct = await Transaction.findAll({
            attributes: [
                'product_id', // ID produk
                [Sequelize.fn('COUNT', Sequelize.col('transactions.id')), 'transactionCount'], // Jumlah transaksi per produk
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'], // Total kuantitas terjual per produk
                [Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenuePerProduct'], // Total pemasukan per produk
            ],
            where: {
                status: 'approved' // Hanya hitung statistik dari transaksi yang disetujui
            },
            group: ['product_id'], // Kelompokkan hasil berdasarkan product_id
            include: [{
                model: Product,    // Sertakan model Product
                attributes: ['name'], // Ambil nama produk saja
            }],
            raw: true, // Mengembalikan data dalam format JSON polos, bukan instance Sequelize
        });

        // Kirim respons JSON berisi semua statistik
        res.json({
            totalTransactions,      // Jumlah total transaksi
            totalRevenue: parseFloat(totalRevenue), // Total pemasukan (dikonversi ke float)
            transactionsPerProduct  // Statistik transaksi per produk
        });
    } catch (err) {
        // Log error di konsol server untuk debugging
        console.error("Error getting transaction stats:", err);
        // Jika terjadi error, kirim status 500 (Internal Server Error)
        res.status(500).json({ message: err.message });
    }
};

// Fungsi untuk MENYETUJUI transaksi (Hanya Manager)
export const approveTransaction = async (req, res) => {
    try {
        // Cari transaksinya berdasarkan ID
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
        
        // Transaksi hanya bisa disetujui jika statusnya masih 'pending'
        if (transaction.status !== 'pending') {
            return res.status(400).json({ msg: "Transaksi sudah tidak dalam status pending." });
        }

        // Cek ulang info produk dan stoknya untuk memastikan tidak ada perubahan atau masalah stok
        const product = await Product.findByPk(transaction.product_id);
        if (!product) return res.status(404).json({ msg: "Product not found for this transaction." });
        
        // Validasi stok terakhir kali sebelum dikurangi
        if (product.stock < transaction.quantity) {
            return res.status(400).json({ msg: "Stok produk tidak mencukupi untuk menyetujui transaksi ini." });
        }

        // PENTING: Di sinilah proses PENGURANGAN STOK terjadi
        await Product.update(
            { stock: product.stock - transaction.quantity }, // Kurangi stok produk sejumlah kuantitas transaksi
            { where: { id: transaction.product_id } } // Hanya update produk yang terkait dengan transaksi ini
        );

        // Setelah stok berhasil dikurangi, ubah status transaksi menjadi 'approved'
        await transaction.update({ status: 'approved' });
        res.json({ msg: "Transaction approved and stock updated." }); // Kirim pesan sukses
    } catch (error) {
        // Log error di konsol server untuk debugging
        console.error("Error approving transaction:", error);
        // Jika terjadi error, kirim status 500 (Internal Server Error)
        res.status(500).json({ msg: error.message });
    }
};

// Fungsi untuk MENOLAK transaksi (Hanya Manager)
export const rejectTransaction = async (req, res) => {
    try {
        // Cari transaksinya berdasarkan ID
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
        
        // Hanya bisa menolak transaksi yang masih 'pending'
        if (transaction.status !== 'pending') {
            return res.status(400).json({ msg: "Transaksi sudah tidak dalam status pending." });
        }

        // Jika transaksi direject, stok tidak perlu dikembalikan karena stok memang belum pernah dikurangi dari awal
        // (Pengurangan stok baru terjadi saat statusnya 'approved').
        await transaction.update({ status: 'rejected' }); // Ubah status transaksi menjadi 'rejected'
        res.json({ msg: "Transaction rejected." }); // Kirim pesan sukses
    } catch (error) {
        // Log error di konsol server untuk debugging
        console.error("Error rejecting transaction:", error);
        // Jika terjadi error, kirim status 500 (Internal Server Error)
        res.status(500).json({ msg: error.message });
    }
};

// Fungsi untuk mendapatkan daftar transaksi yang masih 'pending'
export const getPendingTransactions = async (req, res) => {
    try {
        // Cari semua transaksi dari database dengan kondisi statusnya 'pending'
        const pendingTransactions = await Transaction.findAll({
            where: {
                status: 'pending' // Filter hanya yang statusnya 'pending'
            },
            // Sertakan (JOIN) data dari tabel Product dan User yang terkait
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] },
                { model: User, attributes: ['name', 'email'] }
            ],
            order: [["createdAt", "ASC"]], // Urutkan dari tanggal pembuatan terlama ke terbaru (ASCending)
        });
        res.json(pendingTransactions); // Kirim data transaksi pending sebagai respons JSON
    } catch (err) {
        // Log error di konsol server untuk debugging
        console.error("Error fetching pending transactions:", err);
        // Jika terjadi error, kirim status 500 (Internal Server Error)
        res.status(500).json({ message: err.message });
    }
};