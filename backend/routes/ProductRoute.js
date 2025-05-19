import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/ProductController.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaffOrManager } from "../middleware/VerifyRole.js";

const router = express.Router();

router.get("/public/products", getProducts);
router.use("/products", verifytoken);
router.get("/products", isStaffOrManager, getProducts);
router.get("/products/:id", isStaffOrManager, getProductById);
router.post("/products", isManager, createProduct);
router.patch("/products/:id", isManager, updateProduct);
router.delete("/products/:id", isManager, deleteProduct);

export default router;
