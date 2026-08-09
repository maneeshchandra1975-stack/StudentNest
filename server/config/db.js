'use strict';

const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas.
 * Called once at server startup from index.js
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit process if DB fails
  }
};

module.exports = connectDB;
