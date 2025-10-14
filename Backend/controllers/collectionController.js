import Collection from '../models/Collection.js';

// ✅ Create a new collection (Admin only)
export const createCollection = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const existing = await Collection.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Collection with this name already exists' });
    }

    const collection = await Collection.create({ name, description, image });
    res.status(201).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update collection (Admin only)
export const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete collection (Admin only)
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get all collections (Public)
export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get collection by ID (Public)
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
