const Reading = require("../models/Reading");
const Session = require("../models/Session");
const Device = require("../models/Device");
const Patient = require("../models/Patient");
const Alert = require("../models/Alert");
const { emitEvent } = require("../sockets/socketHandler");

/**
 * Generate unique alert id
 */
const generateAlertId = () => {
  return `ALT-${Date.now()}`;
};

/**
 * ==========================
 * Receive Reading from Device / ESP32
 * POST /api/readings
 * ==========================
 */
const receiveReading = async (req, res) => {
  try {
    const {
      deviceId,
      dripRate,
      flowRate,
      bottleLevel,
      batteryLevel,
      signalStrength,
      temperature,
      aiRiskScore,
      anomalyDetected,
    } = req.body;

    // --------------------------
    // Validate required input
    // --------------------------
    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId is required.",
      });
    }

    if (
      dripRate === undefined ||
      flowRate === undefined ||
      bottleLevel === undefined ||
      batteryLevel === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "dripRate, flowRate, bottleLevel, and batteryLevel are required.",
      });
    }

    // --------------------------
    // Find device
    // --------------------------
    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found.",
      });
    }

    // --------------------------
    // Find active session for device
    // --------------------------
    const session = await Session.findOne({
      device: device._id,
      sessionStatus: "Running",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session found for this device.",
      });
    }

    // --------------------------
    // Find patient
    // --------------------------
    const patient = await Patient.findById(session.patient);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found for active session.",
      });
    }

    // --------------------------
    // Update device live status
    // --------------------------
    device.deviceStatus = "Running";
    device.lastSeen = new Date();
    await device.save();

    // Emit device online event
    emitEvent("device:online", {
      deviceId: device.deviceId,
      device: device._id,
      lastSeen: device.lastSeen,
      status: device.deviceStatus,
    });

    // --------------------------
    // Save reading
    // --------------------------
    const reading = await Reading.create({
      session: session._id,
      device: device._id,
      patient: patient._id,
      timestamp: new Date(),
      dripRate,
      flowRate,
      bottleLevel,
      batteryLevel,
      signalStrength: signalStrength ?? 100,
      temperature: temperature ?? 25,
      aiRiskScore: aiRiskScore ?? 0,
      anomalyDetected: anomalyDetected ?? false,
    });

    // Populate reading for response + socket emit
    const populatedReading = await Reading.findById(reading._id)
      .populate("patient", "patientId fullName bedNumber ward")
      .populate("device", "deviceId deviceName serialNumber")
      .populate("session", "sessionId sessionStatus startTime endTime");

    // Emit reading update event
    emitEvent("reading:update", populatedReading);

    // --------------------------
    // Alert detection logic
    // --------------------------
    let createdAlert = null;

    // LOW BOTTLE ALERT
    if (bottleLevel <= 10) {
      createdAlert = await Alert.create({
        alertId: generateAlertId(),
        patient: patient._id,
        device: device._id,
        session: session._id,
        reading: reading._id,
        alertType: "Low Bottle",
        severity: "High",
        message: `Bottle level is low on device ${device.deviceId}. Remaining volume: ${bottleLevel} ml`,
        notes: "Auto-generated low bottle alert from reading endpoint",
      });
    }

    // HIGH FLOW RATE ALERT
    else if (flowRate > session.flowRate + 20) {
      createdAlert = await Alert.create({
        alertId: generateAlertId(),
        patient: patient._id,
        device: device._id,
        session: session._id,
        reading: reading._id,
        alertType: "High Flow Rate",
        severity: "High",
        message: `Flow rate is too high on device ${device.deviceId}. Current: ${flowRate} ml/hr, Expected: ${session.flowRate} ml/hr`,
        notes: "Auto-generated high flow rate alert from reading endpoint",
      });
    }

    // LOW FLOW RATE ALERT
    else if (flowRate < Math.max(session.flowRate - 15, 1)) {
      createdAlert = await Alert.create({
        alertId: generateAlertId(),
        patient: patient._id,
        device: device._id,
        session: session._id,
        reading: reading._id,
        alertType: "Low Flow Rate",
        severity: "Medium",
        message: `Flow rate is too low on device ${device.deviceId}. Current: ${flowRate} ml/hr, Expected: ${session.flowRate} ml/hr`,
        notes: "Auto-generated low flow rate alert from reading endpoint",
      });
    }

    // AI / anomaly alert
    else if (anomalyDetected === true || (aiRiskScore ?? 0) >= 70) {
      createdAlert = await Alert.create({
        alertId: generateAlertId(),
        patient: patient._id,
        device: device._id,
        session: session._id,
        reading: reading._id,
        alertType: "AI Warning",
        severity: "High",
        message: `Potential anomaly detected on device ${device.deviceId}. AI risk score: ${aiRiskScore ?? 0}`,
        notes: "Auto-generated AI anomaly alert from reading endpoint",
      });
    }

    // Populate alert if created
    let populatedAlert = null;

    if (createdAlert) {
      populatedAlert = await Alert.findById(createdAlert._id)
        .populate("patient", "patientId fullName bedNumber ward")
        .populate("device", "deviceId deviceName serialNumber")
        .populate("session", "sessionId sessionStatus startTime endTime")
        .populate("reading");

      // Emit new alert event
      emitEvent("alert:new", populatedAlert);
    }

    res.status(201).json({
      success: true,
      message: "Reading received successfully.",
      data: {
        reading: populatedReading,
        alert: populatedAlert,
      },
    });
  } catch (error) {
    console.error("Receive Reading Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get Readings
 * GET /api/readings
 * Query:
 * - patient
 * - device
 * - session
 * - startDate
 * - endDate
 * ==========================
 */
const getReadings = async (req, res) => {
  try {
    const { patient, device, session, startDate, endDate } = req.query;

    const filter = {};

    if (patient) filter.patient = patient;
    if (device) filter.device = device;
    if (session) filter.session = session;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const readings = await Reading.find(filter)
      .populate("patient", "patientId fullName bedNumber ward")
      .populate("device", "deviceId deviceName serialNumber")
      .populate("session", "sessionId sessionStatus")
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      total: readings.length,
      data: readings,
    });
  } catch (error) {
    console.error("Get Readings Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  receiveReading,
  getReadings,
};