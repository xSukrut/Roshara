import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        image: {
            type: String
        }
    },
    {timestamps: true}
);

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;