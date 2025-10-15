import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", required: true },
  name: {
    type: String, required: true },
  quantity: {
    type: Number, required: true },
  price: {
    type: Number, required: true }, // price per unit at time of order
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  paymentMethod: {
    type: String, required: true }, // "stripe", "razorpay", "cod", etc.
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  taxPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  itemsPrice: { type: Number, default: 0 }, // sum of price*quantity
  discountAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 }, // itemsPrice + tax + shipping - discount
  status: { type: String, enum: ["pending", "paid", "shipped", "cancelled"], default: "pending" },
  paidAt: Date,
  shippedAt: Date,
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;

