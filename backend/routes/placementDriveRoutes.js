import express from "express";
import {
  createDrive,
  getAllDrives,
  updateDrive,
  deleteDrive,
} from "../controllers/placementDriveController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create new placement drive (TPO only)
router.post("/", protect, authorizeRoles("tpo"), createDrive);

// ✅ Get all drives (Everyone can view)
router.get("/", protect, getAllDrives);

// ✅ Update drive (TPO only)
router.put("/:id", protect, authorizeRoles("tpo"), updateDrive);

// ✅ Delete drive (TPO only)
router.delete("/:id", protect, authorizeRoles("tpo"), deleteDrive);

export default router;
