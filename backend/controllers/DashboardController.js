import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Transaction from "../models/TransactionModel.js";
import { fn, col } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalTransactions = await Transaction.count();

    const monthly = await Transaction.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("COUNT", col("id")), "total"],
      ],
      group: [fn("MONTH", col("createdAt"))],
      raw: true,
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyTransactions = monthNames.map((month, index) => {
      const found = monthly.find(item => parseInt(item.month) === index + 1);
      return {
        month,
        total: found ? parseInt(found.total) : 0,
      };
    });

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
