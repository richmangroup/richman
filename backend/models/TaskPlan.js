// backend/models/TaskPlan.js
import mongoose from "mongoose";

const taskPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },     // e.g. Basic, Standard, Premium
  price: { type: Number, required: true },    // e.g. 5, 10, 15, 20
  videoLimit: { type: Number, required: true } // how many videos user can unlock
});

export default mongoose.models.TaskPlan || mongoose.model("TaskPlan", taskPlanSchema);
