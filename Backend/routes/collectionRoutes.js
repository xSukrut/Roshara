import express from "express";
import {
  createCollection,
  getAllCollections,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
.get(getAllCollections)
.post(protect, admin, createCollection);

router
  .route("/:id")
  .put(protect, admin, updateCollection)
  .delete(protect, admin, deleteCollection);

export default router;

