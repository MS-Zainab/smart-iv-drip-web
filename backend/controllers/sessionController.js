const Session = require("../models/Session");
const Patient = require("../models/Patient");
const Device = require("../models/Device");
const User = require("../models/User");

/**
 * Generate Session ID
 */
const generateSessionId = async () => {
  const count = await Session.countDocuments();
  return `SES-${String(count + 1).padStart(4, "0")}`;
};

/**
 * ==========================
 * Create Session
 * POST /api/sessions
 * ==========================
 */
const createSession = async (req, res) => {
  try {
    const {
      patient,
      device,
      nurse,
      medicineName,
      prescribedVolume,
      infusedVolume,
      flowRate,
      dripFactor,
      expectedDuration,
      startTime,
      remarks,
    } = req.body;

    // Required fields validation
    if (
      !patient ||
      !device ||
      !nurse ||
      !medicineName ||
      prescribedVolume === undefined ||
      flowRate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "patient, device, nurse, medicineName, prescribedVolume and flowRate are required.",
      });
    }

    // Validate patient
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Validate device
    const deviceExists = await Device.findById(device);
    if (!deviceExists) {
      return res.status(404).json({
        success: false,
        message: "Device not found.",
      });
    }

    // Validate nurse
    const nurseExists = await User.findOne({
      _id: nurse,
      role: "Nurse",
    });

    if (!nurseExists) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found.",
      });
    }

    // Prevent duplicate active session on same patient
    const existingPatientSession = await Session.findOne({
      patient,
      sessionStatus: { $in: ["Running", "Paused"] },
    });

    if (existingPatientSession) {
      return res.status(400).json({
        success: false,
        message: "This patient already has an active session.",
      });
    }

    // Prevent duplicate active session on same device
    const existingDeviceSession = await Session.findOne({
      device,
      sessionStatus: { $in: ["Running", "Paused"] },
    });

    if (existingDeviceSession) {
      return res.status(400).json({
        success: false,
        message: "This device is already being used in another active session.",
      });
    }

    // Generate sessionId
    const sessionId = await generateSessionId();

    const newSession = await Session.create({
      sessionId,
      patient,
      device,
      nurse,
      medicineName: medicineName.trim(),
      prescribedVolume: Number(prescribedVolume),
      infusedVolume: infusedVolume ? Number(infusedVolume) : 0,
      flowRate: Number(flowRate),
      dripFactor: dripFactor ? Number(dripFactor) : 20,
      expectedDuration: expectedDuration ? Number(expectedDuration) : 0,
      startTime: startTime ? new Date(startTime) : new Date(),
      remarks: remarks || "",
      sessionStatus: "Running",
    });

    // Update patient IV status
    patientExists.ivStatus = "Running";
    await patientExists.save();

    // Update device assignment / status
    deviceExists.assignedPatient = patientExists._id;
    deviceExists.assignedBy = nurseExists._id;
    deviceExists.deviceStatus = "Running";
    deviceExists.connectivity = "Online";
    deviceExists.lastSeen = new Date();
    await deviceExists.save();

    const populatedSession = await Session.findById(newSession._id)
      .populate({
        path: "patient",
        select: "patientId fullName ward bedNumber ivStatus status",
        populate: {
          path: "ward",
          select: "wardName wardCode",
        },
      })
      .populate(
        "device",
        "deviceId deviceName serialNumber deviceStatus batteryLevel connectivity"
      )
      .populate("nurse", "fullName email role employeeId");

    return res.status(201).json({
      success: true,
      message: "Session created successfully.",
      data: populatedSession,
    });
  } catch (error) {
    console.error("Create Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

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
      .populate(
        "device",
        "deviceId deviceName serialNumber deviceStatus batteryLevel connectivity"
      )
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
  createSession,
  getAllSessions,
  getSessionById,
};