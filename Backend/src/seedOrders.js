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

    // Get a user (assume first customer)
    const user = await User.findOne({ role: "customer" });
    if (!user) throw new Error("No customer found. Seed a customer first!");

    // Get a product (assume first product)
    const product = await Product.findOne();
    if (!product) throw new Error("No product found. Seed products first!");

    const order = await Order.create({
      user: user._id,
      orderItems: [
        {
          product: product._id,
          name: product.name,
          quantity: 2,
          price: product.price,
        },
      ],
      shippingAddress: {
        address: "123 Test Street",
        city: "Mumbai",
        postalCode: "400001",
        country: "India",
      },
      paymentMethod: "Stripe",
      taxPrice: 10,
      shippingPrice: 5,
      totalPrice: product.price * 2 + 10 + 5,
    });

    console.log("🎉 Dummy order created successfully!");
    console.log(order);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding orders:", error);
    process.exit(1);
  }
};

seedOrders();
