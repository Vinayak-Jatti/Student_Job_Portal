import mongoose from "mongoose";

const recruitmentRoundSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
    },
    roundName: { type: String, required: true },
    roundType: {
      type: String,
      enum: ["Written Test", "Technical Interview", "HR Interview", "Final Round"],
      required: true,
    },
    scheduledDate: { type: Date },
    venue: { type: String },
    instructions: { type: String },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed"],
      default: "Scheduled",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("RecruitmentRound", recruitmentRoundSchema);

