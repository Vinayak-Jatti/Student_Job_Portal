import Application from "../models/Application.js";
import PlacementDrive from "../models/placementDrive.js";
import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";
import XLSX from "xlsx";

// Get department statistics (HOD)
export const getDepartmentStatistics = async (req, res) => {
  try {
    const hodUser = await User.findById(req.user.id);
    if (!hodUser || !hodUser.department) {
      return res.status(400).json({ error: "HOD department not found" });
    }

    const department = hodUser.department;

    // Get all students in department
    const students = await StudentProfile.find({ department });
    const totalStudents = students.length;
    const approvedStudents = students.filter((s) => s.isApproved).length;

    // Get applications from department students
    const studentIds = students.map((s) => s.userId);
    const applications = await Application.find({
      studentId: { $in: studentIds },
    }).populate("driveId");

    const stats = {
      department,
      totalStudents,
      approvedStudents,
      pendingApprovals: totalStudents - approvedStudents,
      totalApplications: applications.length,
      selectedApplications: applications.filter(
        (a) => a.status === "Selected" || a.status === "Offer Extended"
      ).length,
      rejectedApplications: applications.filter((a) => a.status === "Rejected").length,
      pendingApplications: applications.filter(
        (a) => a.status === "Applied" || a.status === "Shortlisted"
      ).length,
      offersExtended: applications.filter((a) => a.status === "Offer Extended").length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get drive-wise statistics
export const getDriveStatistics = async (req, res) => {
  try {
    const { driveId } = req.params;
    const drive = await PlacementDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ error: "Drive not found" });
    }

    const applications = await Application.find({ driveId }).populate("studentId", "name email");

    const stats = {
      driveId: drive._id,
      companyName: drive.companyName,
      jobRole: drive.jobRole,
      totalApplications: applications.length,
      selected: applications.filter(
        (a) => a.status === "Selected" || a.status === "Offer Extended"
      ).length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
      pending: applications.filter((a) => a.status === "Applied" || a.status === "Shortlisted")
        .length,
      offersExtended: applications.filter((a) => a.status === "Offer Extended").length,
      applications: applications.map((app) => ({
        studentName: app.studentId?.name,
        studentEmail: app.studentId?.email,
        status: app.status,
        currentRound: app.currentRound,
        packageOffered: app.packageOffered,
      })),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student-wise statistics
export const getStudentStatistics = async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await Application.find({ studentId })
      .populate("driveId")
      .sort({ createdAt: -1 });

    const stats = {
      totalApplications: applications.length,
      selected: applications.filter(
        (a) => a.status === "Selected" || a.status === "Offer Extended"
      ).length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
      pending: applications.filter((a) => a.status === "Applied" || a.status === "Shortlisted")
        .length,
      offersExtended: applications.filter((a) => a.status === "Offer Extended").length,
      applications: applications.map((app) => ({
        driveId: app.driveId?._id,
        companyName: app.driveId?.companyName,
        jobRole: app.driveId?.jobRole,
        status: app.status,
        currentRound: app.currentRound,
        packageOffered: app.packageOffered,
        appliedDate: app.createdAt,
      })),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate Excel report
export const generateExcelReport = async (req, res) => {
  try {
    const { type, driveId, department } = req.query;
    let reportData = [];

    if (type === "department") {
      const hodUser = await User.findById(req.user.id);
      const dept = department || hodUser?.department;
      const students = await StudentProfile.find({ department: dept }).populate("userId");
      const studentIds = students.map((s) => s.userId._id);
      const applications = await Application.find({
        studentId: { $in: studentIds },
      })
        .populate("driveId")
        .populate("studentId");

      reportData = applications.map((app) => ({
        "Student Name": app.studentId?.name,
        "Student Email": app.studentId?.email,
        "Company": app.driveId?.companyName,
        "Job Role": app.driveId?.jobRole,
        "Status": app.status,
        "Current Round": app.currentRound,
        "Package": app.packageOffered || "-",
        "Applied Date": new Date(app.createdAt).toLocaleDateString(),
      }));
    } else if (type === "drive" && driveId) {
      const applications = await Application.find({ driveId })
        .populate("studentId")
        .populate("driveId");

      reportData = applications.map((app) => ({
        "Student Name": app.studentId?.name,
        "Student Email": app.studentId?.email,
        "Status": app.status,
        "Current Round": app.currentRound,
        "Package": app.packageOffered || "-",
        "Applied Date": new Date(app.createdAt).toLocaleDateString(),
      }));
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${type}-${Date.now()}.xlsx`
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate report data (for Excel/PDF)
export const generateReport = async (req, res) => {
  try {
    const { type, driveId, department, studentId } = req.query;

    let reportData = [];

    if (type === "department") {
      const hodUser = await User.findById(req.user.id);
      const dept = department || hodUser?.department;
      const students = await StudentProfile.find({ department: dept }).populate("userId");
      const studentIds = students.map((s) => s.userId._id);
      const applications = await Application.find({
        studentId: { $in: studentIds },
      })
        .populate("driveId")
        .populate("studentId");

      reportData = applications.map((app) => ({
        "Student Name": app.studentId?.name,
        "Student Email": app.studentId?.email,
        "Company": app.driveId?.companyName,
        "Job Role": app.driveId?.jobRole,
        "Status": app.status,
        "Current Round": app.currentRound,
        "Package": app.packageOffered || "-",
        "Applied Date": new Date(app.createdAt).toLocaleDateString(),
      }));
    } else if (type === "drive" && driveId) {
      const applications = await Application.find({ driveId })
        .populate("studentId")
        .populate("driveId");

      reportData = applications.map((app) => ({
        "Student Name": app.studentId?.name,
        "Student Email": app.studentId?.email,
        "Status": app.status,
        "Current Round": app.currentRound,
        "Package": app.packageOffered || "-",
        "Applied Date": new Date(app.createdAt).toLocaleDateString(),
      }));
    } else if (type === "student" && studentId) {
      const applications = await Application.find({ studentId }).populate("driveId");

      reportData = applications.map((app) => ({
        "Company": app.driveId?.companyName,
        "Job Role": app.driveId?.jobRole,
        "Status": app.status,
        "Current Round": app.currentRound,
        "Package": app.packageOffered || "-",
        "Applied Date": new Date(app.createdAt).toLocaleDateString(),
      }));
    }

    res.json({ reportData, type, generatedAt: new Date() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
