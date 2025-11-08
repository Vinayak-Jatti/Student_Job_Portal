import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "hod", "tpo"], default: "student" },
  department: { type: String }, // For students and HOD
  isActive: { type: Boolean, default: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
