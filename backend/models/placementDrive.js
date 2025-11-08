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
    rounds: [
      {
        roundName: { type: String },
        roundType: {
          type: String,
          enum: ["Written Test", "Technical Interview", "HR Interview", "Final Round"],
        },
        scheduledDate: { type: Date },
        venue: { type: String },
        instructions: { type: String },
        status: {
          type: String,
          enum: ["Scheduled", "In Progress", "Completed"],
          default: "Scheduled",
        },
      },
    ],
    totalApplications: { type: Number, default: 0 },
    selectedCount: { type: Number, default: 0 },
    rejectedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("PlacementDrive", placementDriveSchema);
