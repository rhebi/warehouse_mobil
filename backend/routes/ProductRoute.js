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
router.get("/products", isStaff, getProducts);           
router.get("/products/:id", isStaff, getProductById);    
router.post("/products", isManager, createProduct);
router.patch("/products/:id", isManager, updateProduct);  
router.delete("/products/:id", isManager, deleteProduct);

export default router;
