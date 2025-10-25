
import Product from "../models/Product.js";
import Collection from "../models/Collection.js";

//  Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, collection } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    let collectionId = null;

    // If "collection" is provided
    if (collection) {
      // If it's a valid ObjectId, use it directly
      if (collection.match(/^[0-9a-fA-F]{24}$/)) {
        collectionId = collection;
      } else {
        // Otherwise, try finding by collection name
        const foundCollection = await Collection.findOne({ name: collection });
        if (!foundCollection) {
          return res.status(400).json({
            message: `Collection with name "${collection}" not found`,
          });
        }
        collectionId = foundCollection._id;
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      images,
      collection: collectionId,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products (with optional filters)
export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.featured === "true") filter.isFeatured = true;
    if (req.query.collection) filter.collection = req.query.collection;

    const products = await Product.find(filter).populate("collection", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("collection", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, collection } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional collection update
    let collectionId = product.collection;
    if (collection) {
      if (collection.match(/^[0-9a-fA-F]{24}$/)) {
        collectionId = collection;
      } else {
        const foundCollection = await Collection.findOne({ name: collection });
        if (!foundCollection) {
          return res.status(400).json({
            message: `Collection with name "${collection}" not found`,
          });
        }
        collectionId = foundCollection._id;
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.images = images || product.images;
    product.collection = collectionId;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
