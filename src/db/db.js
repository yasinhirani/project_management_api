import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected at: ${connectionInstance.connection.host}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default connectDB;