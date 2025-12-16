import express from "express";
import {
  createReport,
  getReports,
  getMyReports,
  updateReportStatus,
  deleteReport,
  upload,
} from "../controllers/reportController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * CREATE REPORT
 * user only
 */
router.post("/", protect, upload.single("image"), createReport);

/**
 * GET ALL REPORTS
 * public
 */
router.get("/", getReports);

/**
 * GET LOGGED-IN USER REPORTS
 */
router.get("/my", protect, getMyReports);

/**
 * UPDATE REPORT STATUS
 * admin only
 */
router.put("/:id/status", protect, adminOnly, updateReportStatus);

/**
 * DELETE REPORT
 * owner only
 */
router.delete("/:id", protect, deleteReport);

export default router;
