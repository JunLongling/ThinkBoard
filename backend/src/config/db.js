import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
});

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    await mongoose.disconnect();
  }
};
