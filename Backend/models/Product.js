import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        sizes: [String],
        colors: [String],
        images: [String],
        stock: { type: Number, default: 0},
        collection: {type: mongoose.Schema.Types.ObjectId, ref: 'Collection'},
        isFeatured: {type: Boolean, default: false},
        discount: {type: Number, default: 0}
    },
    {timestamps: true}
);

const Product =  mongoose.model('Product', productSchema);
export default Product;