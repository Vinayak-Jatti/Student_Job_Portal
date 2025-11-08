import express from "express";
import {
  applyToDrive,
  getStudentApplications,
  getDriveApplications,
  updateApplicationStatus,
  uploadOfferLetter,
} from "../controllers/applicationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student routes
router.post("/", protect, authorizeRoles("student"), applyToDrive);
router.get("/my-applications", protect, authorizeRoles("student"), getStudentApplications);

// TPO routes
router.get("/drive/:driveId", protect, authorizeRoles("tpo"), getDriveApplications);
router.put("/:applicationId/status", protect, authorizeRoles("tpo"), updateApplicationStatus);
router.put("/:applicationId/offer-letter", protect, authorizeRoles("tpo"), uploadOfferLetter);

export default router;

