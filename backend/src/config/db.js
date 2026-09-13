import mongoose from "mongoose";

const connectDB = async () => {
  console.log(process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connectd to db");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
