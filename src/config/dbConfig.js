import mongoose from "mongoose";

export const mongoConnect = () => {
  try {
    const conStr =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_CLIENT_PROD
        : process.env.MONGO_CLIENT_DEV;
    const connection = mongoose.connect(conStr);
    connection && console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
