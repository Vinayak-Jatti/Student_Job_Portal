import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  getAllStudents,
  approveStudent,
  rejectStudent,
} from "../controllers/studentProfileController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student routes
router.get("/me", protect, authorizeRoles("student"), getStudentProfile);
router.put("/me", protect, authorizeRoles("student"), updateStudentProfile);
router.post("/me/resume", protect, authorizeRoles("student"), uploadResume);

// HOD/TPO routes
router.get("/all", protect, getAllStudents); // Will check role in controller if needed
router.put("/:profileId/approve", protect, authorizeRoles("hod"), approveStudent);
router.put("/:profileId/reject", protect, authorizeRoles("hod"), rejectStudent);

export default router;

