import express from "express";
import {
  createDrive,
  getAllDrives,
  updateDrive,
  deleteDrive,
} from "../controllers/placementController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddlware.js";

const router = express.Router();

// Public route
router.get("/", getAllDrives);

// Protected (TPO only)
router.post("/", protect, authorizeRoles("tpo"), createDrive);
router.put("/:id", protect, authorizeRoles("tpo"), updateDrive);
router.delete("/:id", protect, authorizeRoles("tpo"), deleteDrive);

export default router;
