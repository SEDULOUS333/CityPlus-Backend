import Report from "../models/Report.js";

/* ---------------------------------------------------
   CREATE REPORT (NO AI)
--------------------------------------------------- */
export const createReport = async (req, res) => {
  try {
    const { description, type, lat, lng, address } = req.body;

    if (!description || !lat || !lng) {
      return res
        .status(400)
        .json({ message: "Description and coordinates are required" });
    }

    // Cloudinary gives full URL in req.file.path
    const imageUrl = req.file ? req.file.path : "";

    const newReport = await Report.create({
      userId: req.user ? req.user.id : null,
      description,
      type,
      imageUrl,
      address: address || "",
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },

      // AI fields kept for UI compatibility (unchanged)
      aiImageType: "n/a",
      aiTextType: "n/a",
      aiFinalType: type,
      aiConfidence: 0,

      status: "open",
    });

    return res.status(201).json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (err) {
    console.error("Error creating report:", err.message);
    res.status(500).json({ message: "Error creating report" });
  }
};

/* ---------------------------------------------------
   GET ALL REPORTS
--------------------------------------------------- */
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reports" });
  }
};

/* ---------------------------------------------------
   GET LOGGED-IN USER REPORTS
--------------------------------------------------- */
export const getMyReports = async (req, res) => {
  try {
    const myReports = await Report.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(myReports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your reports" });
  }
};

/* ---------------------------------------------------
   UPDATE STATUS (ADMIN)
--------------------------------------------------- */
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({
      message: "Status updated",
      report: updatedReport,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating report" });
  }
};

/* ---------------------------------------------------
   DELETE REPORT (OWNER / ADMIN)
--------------------------------------------------- */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (
      report.userId?.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this report" });
    }

    // NOTE:
    // We do NOT delete Cloudinary image here
    // to avoid accidental deletion of shared assets

    await report.deleteOne();

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Error deleting report" });
  }
};
