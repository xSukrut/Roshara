import express from "express";
import path from "path";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: "Image uploaded successfully",
    imageUrl,
  });
});

export default router;


