import { Sequelize } from "sequelize";

const db = new Sequelize('warehouse_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;