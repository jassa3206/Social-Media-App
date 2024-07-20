const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
