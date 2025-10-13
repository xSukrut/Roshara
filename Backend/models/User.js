import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email:  {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        }, 
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
        enum: ["customer", "admin"],
        default:"customer",
        },
    },
    { timestamp: true }
);

//Hasing password before saving 

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


//Compare entered password with hased password

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;