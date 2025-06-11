// // Import semua model yang dibutuhkan
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import InventoryMovement from "../models/InventoryMovementModel.js";

// // Fungsi untuk mengambil SEMUA data produk dari database
export const getProducts = async (req, res) => {
    try {
        // // Cari semua produk, dan sertakan nama user yang terakhir mengupdate (relasi 'updater')
        const cars = await Product.findAll({
            include: [{
                model: User,
                as: 'updater',
                attributes: ['name']
            }]
        });
        // // Kirim data produk dalam format JSON
        res.json(cars);
    } catch (err) {
        // // Kalau ada error, kirim status 500 (Internal Server Error)
        res.status(500).json({ message: err.message });
    }
};

// // Fungsi untuk mengambil SATU produk berdasarkan ID-nya
export const getProductById = async (req, res) => {
    try {
        // // Cari produk berdasarkan Primary Key (id) yang dikirim di parameter URL
        const car = await Product.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'updater',
                attributes: ['name']
            }]
        });
        // // Kalau produknya ngga ketemu, kirim status 404 (Not Found)
        if (!car) return res.status(404).json({ message: "Not found" });
        // // Kirim data produknya
        res.json(car);
    } catch (err) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ message: err.message });
    }
};

// // Fungsi untuk membuat produk BARU (Hanya bisa oleh Manager)
export const createProduct = async (req, res) => {
    try {
        // // Ambil data produk baru dari body request
        const { name, model, price, description, stock, location, status, gudang } = req.body;
        // // Buat record baru di tabel Product
        const newCar = await Product.create({
            name, model, price, description, stock, location, status, gudang,
            updatedBy: req.user.userId // // catat siapa yang membuat (diambil dari token)
        });

        // // PENTING: Jika produk baru dibuat dengan stok awal (stock > 0)
        if (stock > 0) {
            // // Maka, kita juga harus mencatatnya sebagai pergerakan stok 'inbound' (barang masuk)
            await InventoryMovement.create({
                product_id: newCar.id,
                quantity: stock,
                type: 'inbound',
                reason: 'initial_stock', // // Alasannya adalah stok awal
                user_id: req.user.userId,
                location_to: gudang || location,
                notes: `Stok awal untuk produk baru: ${name}`
            });
        }
        // // Kirim status 201 (Created) dan data produk yang baru dibuat
        res.status(201).json(newCar);
    } catch (err) {
        // // Kalau ada data yang salah, kirim status 400 (Bad Request)
        res.status(400).json({ message: err.message });
    }
};

// // Fungsi untuk update data produk SECARA PENUH (Hanya bisa oleh Manager)
export const updateProductFull = async (req, res) => {
    try {
        // // Cari dulu produk yang mau di-update
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        // // Simpan info stok lama dan baru untuk perbandingan
        const oldStock = product.stock;
        const newStock = req.body.stock;
        const stockChange = newStock - oldStock; // // Hitung perubahannya

        // // Update semua data produk berdasarkan data baru dari body request
        await product.update({
            name: req.body.name,
            model: req.body.model,
            price: req.body.price,
            description: req.body.description,
            stock: newStock,
            location: req.body.location,
            status: req.body.status,
            gudang: req.body.gudang,
            updatedBy: req.user.userId
        });

        // // PENTING: Jika ada perubahan jumlah stok
        if (stockChange !== 0) {
            // // Catat perubahan ini sebagai 'adjustment' (penyesuaian) di tabel pergerakan inventaris
            await InventoryMovement.create({
                product_id: product.id,
                quantity: Math.abs(stockChange), // // Kuantitasnya adalah nilai absolut dari perubahan
                type: 'adjustment',
                reason: stockChange > 0 ? 'manual_increase_by_manager' : 'manual_decrease_by_manager',
                user_id: req.user.userId,
                notes: `Stok disesuaikan oleh manager. Lama: ${oldStock}, Baru: ${newStock}`
            });
        }

        // // Kirim status 200 (OK) kalau berhasil
        res.status(200).json({ msg: "Product updated by manager" });
    } catch (error) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ msg: error.message });
    }
};

// // Fungsi untuk update data produk SECARA TERBATAS (Bisa oleh Staff)
export const updateProductLimited = async (req, res) => {
    try {
        // // Sama seperti update oleh manager, cari dulu produknya
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        // // Hitung perubahan stok
        const oldStock = product.stock;
        const newStock = req.body.stock;
        const stockChange = newStock - oldStock;

        // // Update hanya field yang diizinkan untuk staff (stok, lokasi, status, gudang)
        await product.update({
            stock: newStock,
            location: req.body.location,
            status: req.body.status,
            gudang: req.body.gudang,
            updatedBy: req.user.userId
        });

        // // Sama seperti sebelumnya, jika stok berubah, catat sebagai 'adjustment'
        if (stockChange !== 0) {
            await InventoryMovement.create({
                product_id: product.id,
                quantity: Math.abs(stockChange),
                type: 'adjustment',
                reason: stockChange > 0 ? 'manual_increase_by_staff' : 'manual_decrease_by_staff',
                user_id: req.user.userId,
                notes: `Stok disesuaikan oleh staff. Lama: ${oldStock}, Baru: ${newStock}`
            });
        }

        // // Kirim status 200 (OK) kalau berhasil
        res.status(200).json({ msg: "Product updated by staff" });
    } catch (error) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ msg: error.message });
    }
};

// // Fungsi untuk MENGHAPUS produk (Hanya bisa oleh Manager)
export const deleteProduct = async (req, res) => {
    try {
        // // Cari produk yang mau dihapus
        const car = await Product.findByPk(req.params.id);
        if (!car) return res.status(404).json({ message: "Not found" });

        // // Hapus produk dari database
        await car.destroy();
        res.json({ message: "Deleted" });
    } catch (err) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ message: err.message });
    }
};

// // Fungsi untuk MENYETUJUI produk (Hanya bisa oleh Manager)
export const approveProduct = async (req, res) => {
    try {
        // // Cari produknya
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        // // Update statusnya menjadi 'available'
        await product.update({ status: 'available', updatedBy: req.user.userId });
        res.json({ msg: "Product approved" });
    } catch (error) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ msg: error.message });
    }
};

// // Fungsi untuk MENOLAK produk (Hanya bisa oleh Manager)
export const rejectProduct = async (req, res) => {
    try {
        // // Cari produknya
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        // // Update statusnya menjadi 'rejected'
        await product.update({ status: 'rejected', updatedBy: req.user.userId });
        res.json({ msg: "Product rejected" });
    } catch (error) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ msg: error.message });
    }
};

// // Fungsi untuk mendapatkan produk yang statusnya masih 'pending' (menunggu persetujuan)
export const getPendingProducts = async (req, res) => {
    try {
        // // Cari semua produk dengan kondisi 'status' adalah 'pending'
        const pendingProducts = await Product.findAll({
            where: {
                status: 'pending'
            },
            include: [{
                model: User,
                as: 'updater',
                attributes: ['name']
            }]
        });
        // // Kirim hasilnya
        res.json(pendingProducts);
    } catch (err) {
        // // Kalau ada error, kirim status 500
        res.status(500).json({ message: err.message });
    }
};