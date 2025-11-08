// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ MONGO_URI not set in .env file");
      throw new Error("MONGO_URI not set in .env");
    }
    
    await mongoose.connect(uri, {
      // Remove deprecated options for newer mongoose versions
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
