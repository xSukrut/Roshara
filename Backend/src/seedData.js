import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Collection from "../models/Collection.js";


dotenv.config();

//Sample Data
const collections = [
  { name: "Men's Collection", description: "Latest fashion for men", image: "https://via.placeholder.com/150" },
  { name: "Women's Collection", description: "Trendy outfits for women", image: "https://via.placeholder.com/150" },
  { name: "Kids Collection", description: "Cute and comfy kids wear", image: "https://via.placeholder.com/150" },
];

const products = [
  {
    name: "Men's T-Shirt",
    description: "Comfortable cotton t-shirt",
    price: 499,
    images: ["https://via.placeholder.com/150"],
    stock: 50,
    featured: true,
  },
  {
    name: "Women's Dress",
    description: "Elegant evening dress",
    price: 1299,
    images: ["https://via.placeholder.com/150"],
    stock: 30,
    featured: true,
  },
  {
    name: "Kids Hoodie",
    description: "Warm and cozy hoodie",
    price: 699,
    images: ["https://via.placeholder.com/150"],
    stock: 40,
    featured: false,
  },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        //clear existing Data
        await Product.deleteMany();
        await Collection.deleteMany();

        console.log("Old Prodcuts and collections cleared");

        //Insert collections 
        const createdCollections = await Collection.insertMany(collections);
        console.log("Collections added successfully");

        //Attach collection IDs to products
        const productsWithCollections = products.map((product, index) => ({
            ...product,
            collection: createdCollections[index % createdCollections.length]._id,
        }));

        //Insert Products
        await Product.insertMany(productsWithCollections);
        console.log("Products added successfully");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();