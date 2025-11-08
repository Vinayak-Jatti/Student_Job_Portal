import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddlware.js";

const router = express.Router();

// Student Dashboard
router.get("/student", protect, authorizeRoles("student"), (req, res) =>
  res.json({ msg: "Welcome to Student Dashboard" })
);

// HOD Dashboard
router.get("/hod", protect, authorizeRoles("hod"), (req, res) =>
  res.json({ msg: "Welcome to HOD Dashboard" })
);

// TPO Dashboard
router.get("/tpo", protect, authorizeRoles("tpo"), (req, res) =>
  res.json({ msg: "Welcome to TPO Dashboard" })
);

export default router;
