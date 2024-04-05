import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDb = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) {
    return console.log("Missing Mongodb URL");
  }
  if (isConnected) {
    return console.log("Mongodb is already connected");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Stores",
    });
    isConnected = true;
    console.log("Mongodb is connected");
  } catch (e) {
    console.log(e);
  }
};
