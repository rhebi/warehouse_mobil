import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/ProductController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { verifyRole } from "../middleware/VerifyRole.js";

const router = express.Router();

router.use("/products", verifytoken);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", verifyRole, createProduct);
router.patch("/products/:id", verifyRole, updateProduct);
router.delete("/products/:id", verifyRole, deleteProduct);

export default router;
