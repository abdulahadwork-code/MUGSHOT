// server/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MONGODB CONNECTED: ${conn.connection.host}`);
  } catch (error) {
    // ✅ FIXED: Removed the space between $ and {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;