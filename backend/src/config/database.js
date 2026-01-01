import mongoose from "mongoose";
import envFile from "./env.js";
import process from "process";

const connectDB = async () => {
    try {
        await mongoose.connect(envFile.MONGODB_URL || "");
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;