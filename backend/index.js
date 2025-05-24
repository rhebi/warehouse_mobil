import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";               
import productRouter from "./routes/ProductRoute.js"; 
import transactionRouter from "./routes/TransactionRoute.js"; 
import initRelations from "./models/initRelations.js";

initRelations();

dotenv.config();

const app = express();

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Database Connected...");
    // await db.sync({ alter: true }); 
  } catch (error) {
    console.error("DB init error:", error);
  }

  app.use(cors({
    credentials: true,
    origin: ['http://localhost:5000', 'http://localhost:5173']
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(router); 
  app.use(productRouter); 
  app.use(transactionRouter); 

  app.listen(5000, () => console.log("Server running at port 5000"));
};

startServer();
