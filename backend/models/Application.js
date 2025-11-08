import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Selected", "Rejected", "Offer Extended"],
      default: "Applied",
    },
    currentRound: { type: String, default: "Application Review" },
    rounds: [
      {
        roundName: { type: String },
        roundType: {
          type: String,
          enum: ["Written Test", "Technical Interview", "HR Interview", "Final Round"],
        },
        status: {
          type: String,
          enum: ["Pending", "Scheduled", "Completed", "Passed", "Failed"],
          default: "Pending",
        },
        scheduledDate: { type: Date },
        remarks: { type: String },
      },
    ],
    offerLetterUrl: { type: String },
    offerLetterFileName: { type: String },
    packageOffered: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

// Ensure one application per student per drive
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);

