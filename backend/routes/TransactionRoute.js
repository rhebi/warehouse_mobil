import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from "../controllers/TransactionController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManagerOrStaff } from "../middleware/VerifyRole.js";

const router = express.Router();

router.get("/transactions", verifytoken, isManagerOrStaff, getTransactions);
router.get("/transactions/:id", verifytoken, isManagerOrStaff, getTransactionById);
router.post("/transactions", verifytoken, isManagerOrStaff, createTransaction);
router.patch("/transactions/:id", verifytoken, isManagerOrStaff, updateTransaction);
router.delete("/transactions/:id", verifytoken, isManagerOrStaff, deleteTransaction);

export default router;
