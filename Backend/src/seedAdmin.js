import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to MongoDB")

        const adminEmail = 'admin@roshara.com';
        const adminPassword = "Admin@123";

        //Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin){
            console.log('Admin already esists with this email:');
            process.exit(0);
        }

        //Hash the Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        //Create admin user
        const adminUser = await User.create({
            name: 'Roshara Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });

    console.log('🎉 Admin user created successfully!');
    console.log('-----------------------------');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log('-----------------------------');

    process.exit(0);
    } catch (error) {
        console.error('error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();