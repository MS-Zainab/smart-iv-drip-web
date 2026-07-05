const Session = require("../models/Session");

/**
 * ==========================
 * Get All Sessions
 * GET /api/sessions
 * ==========================
 */
const getAllSessions = async (req, res) => {
  try {
    const {
      status,
      patient,
      device,
      nurse,
      page = 1,
      limit = 10,
      sort = "createdAt",
    } = req.query;

    const filter = {};

    if (status) filter.sessionStatus = status;
    if (patient) filter.patient = patient;
    if (device) filter.device = device;
    if (nurse) filter.nurse = nurse;

    const sessions = await Session.find(filter)
      .populate({
        path: "patient",
        select: "patientId fullName ward bedNumber",
        populate: {
          path: "ward",
          select: "wardName wardCode",
        },
      })
      .populate("device", "deviceId deviceName")
      .populate("nurse", "fullName email role")
      .sort({ [sort]: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalSessions = await Session.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalSessions,
      currentPage: Number(page),
      totalPages: Math.ceil(totalSessions / Number(limit)),
      data: sessions,
    });
  } catch (error) {
    console.error("Get All Sessions Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get Single Session
 * GET /api/sessions/:id
 * ==========================
 */
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "patient",
        select: "patientId fullName ward bedNumber ivStatus status",
        populate: {
          path: "ward",
          select: "wardName wardCode",
        },
      })
      .populate("device", "deviceId deviceName serialNumber deviceStatus batteryLevel connectivity")
      .populate("nurse", "fullName email role");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Get Session By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllSessions,
  getSessionById,
};