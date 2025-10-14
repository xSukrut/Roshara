import Collection from "../models/Collection.js";

// Create a collection (Admin only)
export const createCollection = async (req, res) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all collections
export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single collection by ID
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update collection (Admin only)
export const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete collection (Admin only)
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json({ message: "Collection deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
