const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('MongoDB Atlas cluster')) {
      console.error('Check MongoDB Atlas Network Access and add your current IP address, or use 0.0.0.0/0 for local development only.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
