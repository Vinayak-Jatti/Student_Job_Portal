import PlacementDrive from "../models/placementDrive.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// ✅ Create a new placement drive (TPO only)
export const createDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.create({
      ...req.body,
      createdBy: req.user.id,
    });

    // Notify all students by email
    const students = await User.find({ role: "student" });
    const emails = students.map((s) => s.email);

    for (const email of emails) {
      await sendEmail(
        email,
        `New Placement Drive: ${drive.companyName}`,
        `A new drive for ${drive.jobRole} at ${drive.companyName} has been announced. Apply before ${drive.lastDateToApply}.`
      );
    }

    res
      .status(201)
      .json({ message: "Drive created and students notified", drive });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all drives
export const getAllDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find().sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a drive (TPO only)
export const updateDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!drive) {
      return res.status(404).json({ error: "Drive not found" });
    }
    res.json({ message: "Drive updated successfully", drive });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a drive (TPO only)
export const deleteDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndDelete(req.params.id);
    if (!drive) {
      return res.status(404).json({ error: "Drive not found" });
    }
    res.json({ message: "Drive deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

