import Product from "../models/Product.js";
import Collection from "../models/Collection.js";

// ✅ Create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, collection, sizes, colors, discount } = req.body;

    if (!name || !price)
      return res.status(400).json({ message: "Name and price are required" });

    let collectionId = null;
    if (collection) {
      const found = await Collection.findOne({ name: collection });
      if (found) collectionId = found._id;
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      images,
      collection: collectionId,
      sizes,
      colors,
      discount,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("collection", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get one product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("collection", "name");
    if (!product) return res.status(404).json({ message: "Not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    Object.assign(product, req.body);
    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    await product.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
