import mongoose from "mongoose";
import { DB_URI } from "../utils/env";
const connectDB = async () => {
  try {
    if (!DB_URI) {
      console.error("❌ DB_URI is not defined in environment variables");
      process.exit(1);
    }
    await mongoose.connect(DB_URI);

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
