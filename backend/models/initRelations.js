import Product from "./ProductModel.js";
import Transaction from "./TransactionModel.js";
import User from "./UserModel.js";

export default function initRelations() {
    // Relasi Transaksi ke Produk
    Product.hasMany(Transaction, { foreignKey: "product_id" });
    Transaction.belongsTo(Product, { foreignKey: "product_id" });

    // Relasi Transaksi ke User (pembuat transaksi)
    User.hasMany(Transaction, { foreignKey: "user_id" });
    Transaction.belongsTo(User, { foreignKey: "user_id" });

    // Relasi Produk ke User (yang mengupdate produk)
    // As 'updater' digunakan untuk membedakan relasi ini dari relasi user_id di transaksi
    User.hasMany(Product, { foreignKey: 'updatedBy', as: 'updatedProducts' }); // User bisa mengupdate banyak produk
    Product.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' }); // Produk diupdate oleh satu user
}