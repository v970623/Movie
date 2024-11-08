import mongoose from "mongoose";
import User from "../models/userModel";
const initializeDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/movie");
    console.log("Connected to MongoDB successfully");

    await User.deleteMany({});
    console.log("Cleared existing user");

    const user = new User({
      username: "user",
      email: "user@example.com",
      password: "123456",
      role: "public",
    });
    await user.save();
    const staff = new User({
      username: "staff",
      email: "staff@example.com",
      password: "123456",
      role: "staff",
    });
    await staff.save();

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

initializeDb();
