import Product from "./ProductModel.js";
import Transaction from "./TransactionModel.js";
import User from "./UserModel.js";

export default function initRelations() {
  Product.hasMany(Transaction, { foreignKey: "product_id" });
  Transaction.belongsTo(Product, { foreignKey: "product_id" });

  User.hasMany(Transaction, { foreignKey: "user_id" });
  Transaction.belongsTo(User, { foreignKey: "user_id" });
}
