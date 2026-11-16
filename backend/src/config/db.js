import mongoose from 'mongoose';

export let isDbConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined in backend/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isDbConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB Connection Notice: ${error.message}`);
    console.warn('👉 To connect to MongoDB Atlas, add your connection string to backend/.env:');
    console.warn('   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/velvi_naturals?retryWrites=true&w=majority');
  }
};

// Monitor connection state events
mongoose.connection.on('connected', () => {
  isDbConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
});

export default connectDB;
