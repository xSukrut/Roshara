import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const customer = await User.findOne({ role: "customer" });
    if (!customer) return console.log("No customer found. Seed a customer first.");

    const products = await Product.find();
    if (products.length === 0) return console.log("No products found. Seed products first.");

    const orderItems = products.slice(0, 2).map(prod => ({
      product: prod._id,
      name: prod.name,
      quantity: 1,
      price: prod.price
    }));

    const order = await Order.create({
      user: customer._id,
      orderItems,
      shippingAddress: {
        address: "123 Main St",
        city: "Mumbai",
        postalCode: "400001",
        country: "India"
      },
      paymentMethod: "cod",
      itemsPrice: orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      totalPrice: orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    });

    console.log("Order seeded:", order);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding orders:", err);
    process.exit(1);
  }
};

seedOrders();
