import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Transaction = db.define("transactions", {
  transaction_code: DataTypes.STRING,
  buyer_name: DataTypes.STRING,
  product_id: DataTypes.INTEGER,
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  total_price: DataTypes.BIGINT,
  user_id: DataTypes.INTEGER,
}, {
  freezeTableName: true
});

export default Transaction;
