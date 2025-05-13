import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize

const Users = db.define('users',{
    name:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING,
        // unique: true
    },
    password:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type: DataTypes.TEXT
    },
    role:         { 
    type: DataTypes.ENUM("staff","manager"), 
    allowNull: false, 
    defaultValue: "staff" 
  }
},{
    freezeTableName:true
})

export default Users;