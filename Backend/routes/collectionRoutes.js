import express from "express";
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Get all
router.get("/", getCollections);

// Admin CRUD
router.post("/", protect, admin, createCollection);
router
  .route("/:id")
  .get(getCollectionById)
  .put(protect, admin, updateCollection)
  .delete(protect, admin, deleteCollection);

export default router;

