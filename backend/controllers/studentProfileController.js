import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// Get or create student profile
export const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let profile = await StudentProfile.findOne({ userId }).populate("userId");

    if (!profile) {
      // Create profile if doesn't exist
      const user = await User.findById(userId);
      profile = await StudentProfile.create({
        userId,
        studentId: `STU${Date.now()}`,
        isApproved: false,
      });
      profile = await StudentProfile.findById(profile._id).populate("userId");
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    let profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      profile = await StudentProfile.create({ userId, ...updates });
    } else {
      Object.assign(profile, updates);
      await profile.save();
    }

    profile = await StudentProfile.findById(profile._id).populate("userId");
    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload resume
export const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumeUrl, resumeFileName } = req.body;

    let profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      profile = await StudentProfile.create({ userId });
    }

    profile.resumeUrl = resumeUrl;
    profile.resumeFileName = resumeFileName;
    await profile.save();

    res.json({ message: "Resume uploaded successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students (HOD/TPO)
export const getAllStudents = async (req, res) => {
  try {
    // Check if user is HOD or TPO
    if (req.user.role !== "hod" && req.user.role !== "tpo") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { department, isApproved } = req.query;
    const query = {};

    // HOD can only see their department students
    if (req.user.role === "hod") {
      const hodUser = await User.findById(req.user.id);
      if (hodUser?.department) {
        query.department = hodUser.department;
      }
    } else if (department) {
      query.department = department;
    }

    if (isApproved !== undefined) {
      query.isApproved = isApproved === "true";
    }

    const students = await StudentProfile.find(query)
      .populate("userId", "name email role")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve student (HOD)
export const approveStudent = async (req, res) => {
  try {
    const { profileId } = req.params;
    const hodId = req.user.id;

    const profile = await StudentProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    profile.isApproved = true;
    profile.approvedBy = hodId;
    profile.approvedAt = new Date();
    await profile.save();

    // Send email
    const user = await User.findById(profile.userId);
    if (user?.email) {
      await sendEmail(
        user.email,
        "Profile Approved - Placement Portal",
        `Congratulations! Your profile has been approved by the HOD. You can now apply to placement drives.`
      );
    }

    res.json({ message: "Student approved successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject student (HOD)
export const rejectStudent = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profile = await StudentProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    profile.isApproved = false;
    profile.approvedBy = null;
    await profile.save();

    res.json({ message: "Student rejection updated", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

