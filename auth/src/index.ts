import mongoose from 'mongoose';
import { app } from './app';

const port = 3000; 


const start = async () => {
  console.log('Starting up auth service...');
  console.log('Environment variables:', {
    JWT_KEY: process.env.JWT_KEY ? 'defined' : 'undefined',
    MONGO_URI: process.env.MONGO_URI ? 'defined' : 'undefined',
  });
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
  app.listen(port, () => {
    console.log(`Auth service listening on port ${port} !!!!!!!!!!!`);
  });
};

start();