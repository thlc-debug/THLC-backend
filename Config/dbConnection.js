const mongoose = require("mongoose");
require("dotenv").config();
// Function to connect to MongoDB Database using mongoose
const connectDB = async () => {
  try {
    // console.log("here")
    await mongoose.connect(process.env.DATABASE_URL, {});
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;