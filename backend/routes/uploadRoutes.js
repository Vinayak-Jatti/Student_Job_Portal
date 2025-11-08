import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadFile, downloadFile } from "../controllers/uploadController.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);
router.get("/:filename", protect, downloadFile);

export default router;

