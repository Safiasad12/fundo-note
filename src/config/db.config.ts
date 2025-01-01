import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = `${process.env.MONGO_URI}`;
    await mongoose.connect(mongoURI);
    logger.info('connected to MongoDB');
  } catch (err) {
    logger.error('Error connecting to MongoDB:', err);
    process.exit(1); 
  }
};

export default connectDB;
