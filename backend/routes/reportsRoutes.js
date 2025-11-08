import express from "express";
import {
  getDepartmentStatistics,
  getDriveStatistics,
  getStudentStatistics,
  generateReport,
  generateExcelReport,
} from "../controllers/reportsController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// HOD routes
router.get("/department", protect, authorizeRoles("hod"), getDepartmentStatistics);

// TPO routes
router.get("/drive/:driveId", protect, authorizeRoles("tpo"), getDriveStatistics);
router.get("/student/:studentId", protect, authorizeRoles("tpo"), getStudentStatistics);
router.get("/generate", protect, authorizeRoles("hod", "tpo"), generateReport);
router.get("/export/excel", protect, authorizeRoles("hod", "tpo"), generateExcelReport);

export default router;

