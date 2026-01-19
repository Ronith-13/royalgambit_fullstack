// Quick script to test MongoDB connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/royalgambit (default)');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/royalgambit';
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully!');
    console.log('Database name:', mongoose.connection.name);
    console.log('Ready state:', mongoose.connection.readyState);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. For local MongoDB: Make sure MongoDB service is running');
    console.error('2. For MongoDB Atlas: Check your connection string and IP whitelist');
    console.error('3. Check server/.env file exists and has correct MONGODB_URI');
    process.exit(1);
  }
};

testConnection();
