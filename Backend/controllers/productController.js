import Product from "../models/Product.js";

//Create Product 
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
};

//Update Product

export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
};

//Delete Product

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted'})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

//Get All Products (PUBLIC)

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('collection');
        res.json(products);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('collection');
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
};

