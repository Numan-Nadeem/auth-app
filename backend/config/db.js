import mongoose from "mongoose";
import { MONGO_DB, NODE_ENV } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB);
    console.log(`Connected to MongoDB in ${NODE_ENV} mode.`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
