import mongoose from "mongoose";
import Submission from "../models/submission.model.js";

const connectDB = async () => {
  try {
    console.log("====================================");
    console.log(process.env.MONGO_URI, "mongo");
    console.log("====================================");
    await mongoose.connect(process.env.MONGO_URI);
    await Submission.init();

    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
