import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import PlacementDrive from "../models/placementDrive.js";
import { sendEmail } from "../utils/sendEmail.js";

// Apply to a drive
export const applyToDrive = async (req, res) => {
  try {
    const { driveId } = req.body;
    const studentId = req.user.id;

    // Check if student profile is approved
    const profile = await StudentProfile.findOne({ userId: studentId });
    if (!profile || !profile.isApproved) {
      return res.status(400).json({ 
        error: "Your profile is not approved yet. Please wait for HOD approval." 
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ studentId, driveId });
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied to this drive" });
    }

    // Check if drive is active
    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ error: "Drive not found" });
    }
    if (drive.status !== "Active") {
      return res.status(400).json({ error: "This drive is not accepting applications" });
    }

    // Create application
    const application = await Application.create({
      studentId,
      driveId,
      status: "Applied",
      currentRound: "Application Review",
    });

    // Update drive application count
    await PlacementDrive.findByIdAndUpdate(driveId, {
      $inc: { totalApplications: 1 },
    });

    // Send confirmation email
    const user = await StudentProfile.findOne({ userId: studentId }).populate('userId');
    if (user?.userId?.email) {
      await sendEmail(
        user.userId.email,
        `Application Submitted - ${drive.companyName}`,
        `Your application for ${drive.jobRole} at ${drive.companyName} has been submitted successfully.`
      );
    }

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student applications
export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const applications = await Application.find({ studentId })
      .populate("driveId")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applications for a drive (TPO)
export const getDriveApplications = async (req, res) => {
  try {
    const { driveId } = req.params;
    const applications = await Application.find({ driveId })
      .populate("studentId", "name email department")
      .sort({ createdAt: -1 });
    
    // Populate student profiles separately
    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await StudentProfile.findOne({ userId: app.studentId });
        return {
          ...app.toObject(),
          studentProfile: profile || null,
        };
      })
    );
    
    res.json(applicationsWithProfiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update application status (TPO)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, currentRound, remarks, roundStatus } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update application
    const updates = {};
    if (status) updates.status = status;
    if (currentRound) updates.currentRound = currentRound;
    if (remarks) updates.remarks = remarks;

    // Update round status if provided
    if (roundStatus && req.body.roundIndex !== undefined) {
      application.rounds[req.body.roundIndex].status = roundStatus;
      if (req.body.roundRemarks) {
        application.rounds[req.body.roundIndex].remarks = req.body.roundRemarks;
      }
    }

    Object.assign(application, updates);
    await application.save();

    // Update drive counts
    const drive = await PlacementDrive.findById(application.driveId);
    if (status === "Selected") {
      await PlacementDrive.findByIdAndUpdate(application.driveId, {
        $inc: { selectedCount: 1 },
      });
    } else if (status === "Rejected") {
      await PlacementDrive.findByIdAndUpdate(application.driveId, {
        $inc: { rejectedCount: 1 },
      });
    }

    // Send email notification
    const profile = await StudentProfile.findOne({ userId: application.studentId }).populate('userId');
    if (profile?.userId?.email) {
      const drive = await PlacementDrive.findById(application.driveId);
      await sendEmail(
        profile.userId.email,
        `Application Update - ${drive.companyName}`,
        `Your application status for ${drive.jobRole} at ${drive.companyName} has been updated to: ${status}`
      );
    }

    res.json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload offer letter (TPO)
export const uploadOfferLetter = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { offerLetterUrl, offerLetterFileName, packageOffered } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.offerLetterUrl = offerLetterUrl;
    application.offerLetterFileName = offerLetterFileName;
    application.packageOffered = packageOffered;
    application.status = "Offer Extended";
    await application.save();

    // Send email
    const profile = await StudentProfile.findOne({ userId: application.studentId }).populate('userId');
    if (profile?.userId?.email) {
      const drive = await PlacementDrive.findById(application.driveId);
      await sendEmail(
        profile.userId.email,
        `Congratulations! Offer Letter - ${drive.companyName}`,
        `Congratulations! You have been selected for ${drive.jobRole} at ${drive.companyName}. Please check your application for the offer letter.`
      );
    }

    res.json({ message: "Offer letter uploaded successfully", application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

