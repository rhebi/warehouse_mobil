// // Import semua model yang akan dihubungkan
import Product from "./ProductModel.js";
import Transaction from "./TransactionModel.js";
import User from "./UserModel.js";
import InventoryMovement from "./InventoryMovementModel.js";

// // Fungsi untuk menginisialisasi semua hubungan antar tabel
export default function initRelations() {
    // // HUBUNGAN 1: Produk dengan Transaksi
    // // Satu Produk bisa memiliki BANYAK Transaksi (hasMany)
    Product.hasMany(Transaction, { foreignKey: "product_id" });
    // // Satu Transaksi hanya dimiliki oleh SATU Produk (belongsTo)
    Transaction.belongsTo(Product, { foreignKey: "product_id" });

    // // HUBUNGAN 2: User dengan Transaksi
    // // Satu User bisa membuat BANYAK Transaksi
    User.hasMany(Transaction, { foreignKey: "user_id" });
    // // Satu Transaksi hanya dibuat oleh SATU User
    Transaction.belongsTo(User, { foreignKey: "user_id" });

    // // HUBUNGAN 3: User dengan Produk
    // // Satu User bisa mengupdate BANYAK Produk
    User.hasMany(Product, { foreignKey: 'updatedBy', as: 'updatedProducts' });
    // // Satu Produk hanya diupdate oleh SATU User terakhir (diberi alias 'updater')
    Product.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

    // // HUBUNGAN 4: Produk dengan Pergerakan Inventaris (InventoryMovement)
    // // Satu Produk bisa memiliki BANYAK riwayat pergerakan stok
    Product.hasMany(InventoryMovement, { foreignKey: 'product_id' });
    // // Satu riwayat pergerakan stok hanya untuk SATU Produk
    InventoryMovement.belongsTo(Product, { foreignKey: 'product_id' });

    // // HUBUNGAN 5: User dengan Pergerakan Inventaris
    // // Satu User bisa mencatat BANYAK pergerakan stok
    User.hasMany(InventoryMovement, { foreignKey: 'user_id', as: 'recordedMovements' });
    // // Satu riwayat pergerakan stok hanya dicatat oleh SATU User
    InventoryMovement.belongsTo(User, { foreignKey: 'user_id' });
}