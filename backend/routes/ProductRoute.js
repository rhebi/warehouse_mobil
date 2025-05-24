import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/ProductController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff } from "../middleware/VerifyRole.js";

const router = express.Router();


router.get("/public/products", getProducts);
router.use("/products", verifytoken);
router.get("/products", isStaff, getProducts);           // staff bisa lihat semua
router.get("/products/:id", isStaff, getProductById);    // staff bisa lihat 1 item
router.post("/products", isManager, createProduct);
router.patch("/products/:id", updateProduct);  // <-- hapus isManager di sini
router.delete("/products/:id", isManager, deleteProduct);

export default router;
