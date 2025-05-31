import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductFull,
  updateProductLimited,
  deleteProduct,
  approveProduct
} from "../controllers/ProductController.js";

import { verifytoken } from "../middleware/VerifyToken.js";
import { isManager, isStaff, isManagerOrStaff } from "../middleware/VerifyRole.js";

const router = express.Router();

// Public access
router.get("/public/products", getProducts);

// Protected routes
router.use("/products", verifytoken);

// Shared access
router.get("/products", isManagerOrStaff, getProducts);
router.get("/products/:id", isManagerOrStaff, getProductById);

// Manager-only
router.post("/products", isManager, createProduct);
router.patch("/products/:id", isManager, updateProductFull);
router.delete("/products/:id", isManager, deleteProduct);
router.patch("/products/:id/approve", isManager, approveProduct);

// Staff-only (update stock, location, status)
router.patch("/products/:id/limited", isStaff, updateProductLimited);

export default router;
