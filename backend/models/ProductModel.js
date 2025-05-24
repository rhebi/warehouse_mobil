import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Product = db.define("products", {
  name: DataTypes.STRING,
  model: DataTypes.STRING,
  price: DataTypes.INTEGER,
  imageName: DataTypes.STRING,
  description: DataTypes.TEXT,
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  freezeTableName: true
});

export default Product;
