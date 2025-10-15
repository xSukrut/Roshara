import Collection from "../models/Collection.js";

// Create Collection
export const createCollection = async (req, res) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json(collection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Collections
export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Collection
export const updateCollection = async (req, res) => {
  try {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Collection
export const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Collection deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
