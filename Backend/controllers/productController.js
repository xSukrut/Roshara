// controllers/productController.js
import Product from "../models/productModel.js";
import Collection from "../models/collectionModel.js";

async function resolveCollectionId(collectionInput) {
  if (!collectionInput) return null;

  // treat as id
  if (typeof collectionInput === "string" && /^[0-9a-fA-F]{24}$/.test(collectionInput)) {
    return collectionInput;
  }

  const found = await Collection.findOne({ name: collectionInput });
  return found ? found._id : null;
}

//  Create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, collection, sizes, colors, discount } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Name and price are required" });

    const collectionId = await resolveCollectionId(collection);

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

//  Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("collection", "name")
      .sort({ createdAt: -1 }); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//  Get one product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("collection", "name");
    if (!product) return res.status(404).json({ message: "Not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update 
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    if (Object.prototype.hasOwnProperty.call(req.body, "collection")) {
      req.body.collection = await resolveCollectionId(req.body.collection);
    }

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

// ✅ NEW: products by collection
export const getProductsByCollection = async (req, res) => {
  try {
    const { id } = req.params; // collection id
    const items = await Product.find({ collection: id }).populate("collection", "name");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
