import Collection from "../models/collectionModel.js";
import Product from "../models/productModel.js";

// ✅ Create a new collection
export const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Collection.findOne({ name });
    if (existing) return res.status(400).json({ message: "Collection already exists" });

    const collection = await Collection.create({ name, description });
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all collections
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get single collection by ID
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update collection
export const updateCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    collection.name = name || collection.name;
    collection.description = description || collection.description;

    const updated = await collection.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete collection
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    await collection.deleteOne();
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getCollectionProductsAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    const inCollection = await Product.find({ collection: id })
      .select("name price images");

    const outside = await Product.find({
      $or: [
        { collection: { $exists: false } },
        { collection: null },
        { collection: { $ne: id } },
      ],
    }).select("name price images");

    res.json({ inCollection, outside });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateCollectionProductsAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { add = [], remove = [] } = req.body;

    const addRes = await Product.updateMany(
      { _id: { $in: add } },
      { $set: { collection: id } }
    );

    const removeRes = await Product.updateMany(
      { _id: { $in: remove }, collection: id },
      { $set: { collection: null } }
    );

    res.json({
      added: addRes.modifiedCount,
      removed: removeRes.modifiedCount,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
