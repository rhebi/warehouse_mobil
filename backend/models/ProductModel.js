import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Product = db.define("products", {
  name: DataTypes.STRING,
  model: DataTypes.STRING,
  price: DataTypes.BIGINT,
  description: DataTypes.TEXT,
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Gudang A'
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('available', 'maintenance', 'sold'),
    defaultValue: 'available'
  },
  gudang: {
    type: DataTypes.STRING,
    defaultValue: "Gudang A"
  },
  updatedBy: {
    type: DataTypes.STRING
  }  
}, {
  freezeTableName: true
});

export default Product;
