import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js"; // Import UserModel untuk relasi updatedBy

// GET semua produk
export const getProducts = async (req, res) => {
    try {
        // Tambahkan include untuk menampilkan siapa yang terakhir mengupdate produk
        const cars = await Product.findAll({
            include: [{
                model: User,
                as: 'updater', // Menggunakan alias 'updater' yang didefinisikan di initRelations
                attributes: ['name'] // Hanya ambil nama updater
            }]
        });
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET produk by ID
export const getProductById = async (req, res) => {
    try {
        const car = await Product.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'updater',
                attributes: ['name']
            }]
        });
        if (!car) return res.status(404).json({ message: "Not found" });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE produk (Manager only)
export const createProduct = async (req, res) => {
    try {
        const { name, model, price, description, stock, location, status, gudang } = req.body;
        const newCar = await Product.create({
            name, model, price, description, stock, location, status, gudang,
            updatedBy: req.user.userId // Menggunakan userId dari token
        });
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PATCH produk (Manager full update)
export const updateProductFull = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        await product.update({
            name: req.body.name,
            model: req.body.model,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            location: req.body.location,
            status: req.body.status,
            gudang: req.body.gudang,
            updatedBy: req.user.userId // Menggunakan userId dari token
        });

        res.status(200).json({ msg: "Product updated by manager" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// PATCH produk (Staff: stock, location, status)
export const updateProductLimited = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        await product.update({
            stock: req.body.stock,
            location: req.body.location,
            status: req.body.status,
            gudang: req.body.gudang,
            updatedBy: req.user.userId // Menggunakan userId dari token
        });

        res.status(200).json({ msg: "Product updated by staff" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// DELETE produk (Manager only)
export const deleteProduct = async (req, res) => {
    try {
        const car = await Product.findByPk(req.params.id);
        if (!car) return res.status(404).json({ message: "Not found" });

        await car.destroy();
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// APPROVE produk (Manager only)
export const approveProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        await product.update({ status: 'available', updatedBy: req.user.userId });
        res.json({ msg: "Product approved" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// REJECT produk (Manager only) - Tambahan jika ada status pending
export const rejectProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        await product.update({ status: 'rejected', updatedBy: req.user.userId });
        res.json({ msg: "Product rejected" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Mendapatkan produk dengan status 'pending' (jika ada alur persetujuan)
export const getPendingProducts = async (req, res) => {
    try {
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
        res.json(pendingProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};