// backend/seedPlans.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import TaskPlan from "./models/TaskPlan.js";

dotenv.config();

const plans = [
  { name: "Starter Plan", price: 5, videoLimit: 5 },
  { name: "Pro Plan", price: 10, videoLimit: 15 },
  { name: "VIP Plan", price: 20, videoLimit: 40 }
];

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await TaskPlan.deleteMany(); // Purane plans hata do
    await TaskPlan.insertMany(plans);

    console.log("✅ Task plans inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting plans:", err);
    mongoose.connection.close();
  }
};

seedPlans();
