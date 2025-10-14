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

//Admin Routes

router.post("/", protect, admin, createProduct);
router.put('/:id', protect, admin,  updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

//Public Routes

router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;