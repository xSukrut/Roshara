import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, admin, createProduct);
router
.route("/:id")
.get(getProductById)
.put(protect, admin, updateProduct)
.delete(protect, admin, deleteProduct);

export default router;