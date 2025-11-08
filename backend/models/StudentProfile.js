import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: { type: String, unique: true, sparse: true },
    department: { type: String },
    year: { type: String },
    phone: { type: String },
    address: { type: String },
    cgpa: { type: String },
    resumeUrl: { type: String },
    resumeFileName: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    isApproved: { type: Boolean, default: false },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // HOD
    },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);

