import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Sequelize, fn, col } from "sequelize";

// Get all transactions (include Product & User)
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] }, // Tambahkan location & gudang
                { model: User, attributes: ['name', 'email'] } // Ubah 'username' ke 'name' sesuai UserModel
            ],
            order: [["createdAt", "DESC"]],
        });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get transaction by ID (include Product & User)
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id, {
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] }, // Tambahkan location & gudang
                { model: User, attributes: ['name', 'email'] } // Ubah 'username' ke 'name'
            ],
        });
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create transaction (hitung total_price dari product price * quantity, tambahkan status transaksi)
export const createTransaction = async (req, res) => {
    try {
        const { transaction_code, buyer_name, product_id, quantity, location, status, gudang } = req.body;
        const user_id = req.user.userId; // User yang membuat transaksi

        const product = await Product.findByPk(product_id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.stock < quantity) return res.status(400).json({ message: "Stok produk tidak mencukupi" });

        const total_price = product.price * quantity;
        const newTransaction = await Transaction.create({
            transaction_code,
            buyer_name,
            product_id,
            quantity,
            total_price,
            user_id,
            location: location || product.location, // Gunakan location dari request atau dari produk
            status: status || 'pending', // Default status 'pending'
            gudang: gudang || product.gudang, // Gunakan gudang dari request atau dari produk
        });

        // Kurangi stok produk setelah transaksi dibuat
        await Product.update(
            { stock: product.stock - quantity },
            { where: { id: product_id } }
        );

        const createdTransaction = await Transaction.findByPk(newTransaction.id, {
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] },
                { model: User, attributes: ['name', 'email'] }
            ],
        });

        res.status(201).json(createdTransaction);
    } catch (err) {
        console.error("Error creating transaction:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update transaction (hitung ulang total_price, tambahkan status transaksi)
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        const { buyer_name, product_id, quantity, location, status, gudang } = req.body;

        const oldProductId = transaction.product_id;
        const oldQuantity = transaction.quantity;

        const pid = product_id || oldProductId;
        const qty = quantity || oldQuantity;

        const product = await Product.findByPk(pid);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Hitung perbedaan stok
        let stockChange = 0;
        if (pid === oldProductId) { // Jika produknya sama
            stockChange = oldQuantity - qty; // Jika qty baru lebih besar, stockChange negatif
        } else { // Jika produknya beda
            // Kembalikan stok produk lama
            await Product.update({ stock: Sequelize.literal(`stock + ${oldQuantity}`) }, { where: { id: oldProductId } });
            // Kurangi stok produk baru
            stockChange = -qty;
        }

        // Cek stok baru
        const newStock = product.stock + stockChange;
        if (newStock < 0) return res.status(400).json({ message: "Stok produk tidak mencukupi untuk update ini" });

        const total_price = product.price * qty;

        await transaction.update({
            buyer_name: buyer_name || transaction.buyer_name,
            product_id: pid,
            quantity: qty,
            total_price,
            location: location || transaction.location,
            status: status || transaction.status,
            gudang: gudang || transaction.gudang,
        });

        // Update stok produk yang terlibat
        await Product.update(
            { stock: newStock },
            { where: { id: pid } }
        );


        const updatedTransaction = await Transaction.findByPk(req.params.id, {
            include: [
                { model: Product, attributes: ['name', 'location', 'gudang'] },
                { model: User, attributes: ['name', 'email'] }
            ],
        });

        res.json(updatedTransaction);
    } catch (err) {
        console.error("Error updating transaction:", err);
        res.status(500).json({ message: err.message });
    }
};

// Delete transaction (kembalikan stok produk)
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        // Kembalikan stok produk
        await Product.update(
            { stock: Sequelize.literal(`stock + ${transaction.quantity}`) },
            { where: { id: transaction.product_id } }
        );

        await transaction.destroy();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Error deleting transaction:", err);
        res.status(500).json({ message: err.message });
    }
};

// Stats transaksi (sudah ada, tidak perlu diubah)
export const getTransactionStats = async (req, res) => {
    try {
        const totalTransactions = await Transaction.count();

        const totalRevenueResult = await Transaction.findOne({
            attributes: [[Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenue']]
        });
        const totalRevenue = totalRevenueResult.dataValues.totalRevenue || 0;

        const transactionsPerProduct = await Transaction.findAll({
            attributes: [
                'product_id',
                [Sequelize.fn('COUNT', Sequelize.col('transactions.id')), 'transactionCount'],
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'],
                [Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenuePerProduct'],
            ],
            group: ['product_id'],
            include: [{
                model: Product,
                attributes: ['name'],
            }],
            raw: true, 
        });

        res.json({
            totalTransactions,
            totalRevenue,
            transactionsPerProduct
        });
    } catch (err) {
        console.error("Error getting transaction stats:", err);
        res.status(500).json({ message: err.message });
    }
};

// Manager bisa approve/reject transaksi (misalnya)
export const approveTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
        await transaction.update({ status: 'approved' });
        res.json({ msg: "Transaction approved" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const rejectTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
        await transaction.update({ status: 'rejected' });
        res.json({ msg: "Transaction rejected" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};