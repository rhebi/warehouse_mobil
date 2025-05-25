import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct
} from "../controllers/ProductController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import {
  isManager,
  isStaff,
  isManagerOrStaff
} from "../middleware/VerifyRole.js";

const router = express.Router();

router.get("/public/products", getProducts);
router.use("/products", verifytoken);
router.get("/products", isManagerOrStaff, getProducts);
router.get("/products/:id", isManagerOrStaff, getProductById);
router.post("/products", isManager, createProduct);
router.patch("/products/:id", isManager, updateProduct);
router.delete("/products/:id", isManager, deleteProduct);
router.patch("/products/:id/stock", isStaff, updateProductStock);

export default router;
