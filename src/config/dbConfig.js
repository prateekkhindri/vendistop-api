import mongoose from "mongoose";

export const mongoConnect = () => {
  try {
    const conStr = process.env.MONGO_CLIENT;
    const connection = mongoose.connect(conStr);
    connection && console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
