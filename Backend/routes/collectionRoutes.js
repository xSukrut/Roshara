import express from 'express';
import {
  createCollection,
  updateCollection,
  deleteCollection,
  getAllCollections,
  getCollectionById,
} from '../controllers/collectionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes (protected)
router.post('/', protect, admin, createCollection);
router.put('/:id', protect, admin,  updateCollection);
router.delete('/:id', protect, admin, deleteCollection);

// Public routes
router.get('/', getAllCollections);
router.get('/:id', getCollectionById);

export default router;
