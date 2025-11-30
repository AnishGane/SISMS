import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    // Avoid reconnecting on hot reload (especially in dev)
    if (mongoose.connection.readyState === 1) {
      console.log("⚡ Already connected to MongoDB");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI + "db-sisms");

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Stop the server on DB fail
  }
};

export default connectDB;
