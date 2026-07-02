const Device = require("../models/Device");
const Ward = require("../models/Ward");
const Patient = require("../models/Patient");
const Session = require("../models/Session");
const Reading = require("../models/Reading");

/**
 * ==========================
 * Register New Device
 * POST /api/devices
 * ==========================
 */
const registerDevice = async (req, res) => {
  try {
    const {
      deviceId,
      serialNumber,
      deviceName,
      ward,
      firmwareVersion,
      batteryLevel,
      connectivity,
      deviceStatus,
      calibrationDate,
      location,
      notes,
    } = req.body;

    // Required fields
    if (!deviceId || !serialNumber || !ward) {
      return res.status(400).json({
        success: false,
        message: "deviceId, serialNumber and ward are required.",
      });
    }

    // Duplicate checks
    const existingDeviceId = await Device.findOne({ deviceId });
    if (existingDeviceId) {
      return res.status(400).json({
        success: false,
        message: "Device ID already exists.",
      });
    }

    const existingSerial = await Device.findOne({ serialNumber });
    if (existingSerial) {
      return res.status(400).json({
        success: false,
        message: "Serial number already exists.",
      });
    }

    // Ward validation
    const wardExists = await Ward.findById(ward);
    if (!wardExists) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    const device = await Device.create({
      deviceId,
      serialNumber,
      deviceName,
      ward,
      firmwareVersion,
      batteryLevel,
      connectivity,
      deviceStatus,
      calibrationDate,
      location,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Device registered successfully.",
      data: device,
    });
  } catch (error) {
    console.error("Register Device Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get All Devices
 * GET /api/devices
 * ==========================
 */
const getAllDevices = async (req, res) => {
  try {
    const {
      ward,
      deviceStatus,
      connectivity,
      search,
      page = 1,
      limit = 10,
      sort = "createdAt",
    } = req.query;

    const filter = {};

    if (ward) filter.ward = ward;
    if (deviceStatus) filter.deviceStatus = deviceStatus;
    if (connectivity) filter.connectivity = connectivity;

    if (search) {
      filter.$or = [
        { deviceId: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { deviceName: { $regex: search, $options: "i" } },
      ];
    }

    const devices = await Device.find(filter)
      .populate("ward", "wardName wardCode")
      .populate("assignedPatient", "patientId fullName bedNumber ivStatus")
      .populate("assignedBy", "fullName email role")
      .sort({ [sort]: 1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    const totalDevices = await Device.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalDevices,
      currentPage: Number(page),
      totalPages: Math.ceil(totalDevices / Number(limit)),
      data: devices,
    });
  } catch (error) {
    console.error("Get Devices Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get Single Device
 * GET /api/devices/:id
 * ==========================
 */
const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate("ward")
      .populate("assignedPatient")
      .populate("assignedBy", "-password");

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found.",
      });
    }

    const sessions = await Session.find({ device: device._id })
      .populate("patient", "patientId fullName bedNumber")
      .populate("nurse", "fullName email")
      .sort({ createdAt: -1 })
      .limit(10);

    const readings = await Reading.find({ device: device._id })
      .sort({ timestamp: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        device,
        sessions,
        readings,
      },
    });
  } catch (error) {
    console.error("Get Device Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Force Reconnect Device
 * POST /api/devices/:id/reconnect
 * ==========================
 */
const forceReconnect = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found.",
      });
    }

    device.connectivity = "Online";
    device.lastSeen = new Date();

    await device.save();

    res.status(200).json({
      success: true,
      message: "Device reconnected successfully.",
      data: device,
    });
  } catch (error) {
    console.error("Force Reconnect Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Unassign Device
 * POST /api/devices/:id/unassign
 * ==========================
 */
const unassignDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found.",
      });
    }

    // If device has assigned patient, update patient IV status if needed
    if (device.assignedPatient) {
      const patient = await Patient.findById(device.assignedPatient);

      if (patient && patient.ivStatus === "Running") {
        patient.ivStatus = "Stopped";
        await patient.save();
      }
    }

    device.assignedPatient = null;
    device.assignedBy = null;
    device.deviceStatus = "Available";

    await device.save();

    res.status(200).json({
      success: true,
      message: "Device unassigned successfully.",
      data: device,
    });
  } catch (error) {
    console.error("Unassign Device Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  registerDevice,
  getAllDevices,
  getDeviceById,
  forceReconnect,
  unassignDevice,
};