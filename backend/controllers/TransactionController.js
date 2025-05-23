import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";

// Get all transactions (include Product & User)
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: Product, attributes: ['name'] }],
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
      include: [{ model: Product, attributes: ['name'] }]
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create transaction (hitung total_price dari product price * quantity)
export const createTransaction = async (req, res) => {
  try {
    const { transaction_code, buyer_name, product_id, quantity } = req.body;
    const user_id = req.user.userId;

    // Ambil product untuk harga
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const total_price = product.price * quantity;
    const newTransaction = await Transaction.create({
      transaction_code,
      buyer_name,
      product_id,
      quantity,
      total_price,
      user_id,
    });

    // Return transaction lengkap include product dan user
    const createdTransaction = await Transaction.findByPk(newTransaction.id, {
      include: [Product, User],
    });

    res.json(createdTransaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update transaction (hitung ulang total_price)
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    const { buyer_name, product_id, quantity } = req.body;

    const pid = product_id || transaction.product_id;
    const qty = quantity || transaction.quantity;

    const product = await Product.findByPk(pid);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const total_price = product.price * qty;

    await transaction.update({
      buyer_name: buyer_name || transaction.buyer_name,
      product_id: pid,
      quantity: qty,
      total_price,
    });

    const updatedTransaction = await Transaction.findByPk(req.params.id, {
      include: [Product, User],
    });

    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    await transaction.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
