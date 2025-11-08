import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    jobRole: { type: String, required: true },
    jobDescription: { type: String },
    eligibilityCriteria: { type: String },
    package: { type: String },
    location: { type: String },
    lastDateToApply: { type: Date },
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // TPO/Admin
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlacementDrive", placementDriveSchema);
